import io
from decimal import Decimal
from django.db import transaction
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Invoice, InvoiceItem, Payment
from .serializers import InvoiceSerializer, InvoiceItemSerializer, PaymentSerializer
from notifications.models import Notification
from accounts.permissions import IsStaff, IsInvoiceAccessAllowed

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Invoice.objects.none()
        if user.is_admin or user.is_staff_member:
            return Invoice.objects.all().order_by('-issue_date')
        if user.is_client:
            return Invoice.objects.filter(project__client=user).order_by('-issue_date')
        return Invoice.objects.none()

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'pdf', 'pay']:
            return [permissions.IsAuthenticated(), IsInvoiceAccessAllowed()]
        return [IsStaff()]

    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        invoice = self.get_object()
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        elements = []
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            'InvoiceTitle',
            parent=styles['Heading1'],
            fontSize=22,
            leading=26,
            textColor=colors.HexColor('#111827'),
            fontName='Helvetica-Bold'
        )
        body_style = ParagraphStyle(
            'InvoiceBody',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#374151')
        )

        elements.append(Paragraph(f"INVOICE {invoice.invoice_number}", title_style))
        elements.append(Spacer(1, 10))

        header_data = [
            [
                Paragraph(f"<b>Client:</b> {invoice.project.client.get_full_name() or invoice.project.client.username}<br/>"
                          f"<b>Project:</b> {invoice.project.name}", body_style),
                Paragraph(f"<b>Issue Date:</b> {invoice.issue_date}<br/>"
                          f"<b>Due Date:</b> {invoice.due_date}<br/>"
                          f"<b>Status:</b> {invoice.get_status_display()}", body_style)
            ]
        ]
        header_table = Table(header_data, colWidths=[270, 270])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ]))
        elements.append(header_table)
        elements.append(Spacer(1, 15))

        items_data = [["Description", "Qty", "Unit Price", "Total"]]
        for item in invoice.items.all():
            items_data.append([
                item.description,
                str(item.quantity),
                f"${item.unit_price:,.2f}",
                f"${(item.quantity * item.unit_price):,.2f}"
            ])

        if len(items_data) == 1:
            items_data.append(["Project Service Milestone Settlement", "1", f"${invoice.subtotal:,.2f}", f"${invoice.subtotal:,.2f}"])

        items_table = Table(items_data, colWidths=[280, 50, 100, 110])
        items_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F3F4F6')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#111827')),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 9),
            ('ALIGN', (1,0), (-1,-1), 'RIGHT'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E5E7EB')),
        ]))
        elements.append(items_table)
        elements.append(Spacer(1, 15))

        summary_data = [
            ["Subtotal:", f"${invoice.subtotal:,.2f}"],
            ["Tax:", f"${invoice.tax:,.2f}"],
            ["Discount:", f"-${invoice.discount:,.2f}"],
            ["Total:", f"${invoice.total:,.2f}"],
            ["Amount Paid:", f"${invoice.amount_paid:,.2f}"],
            ["Balance Due:", f"${invoice.balance:,.2f}"],
        ]
        summary_table = Table(summary_data, colWidths=[430, 110])
        summary_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'RIGHT'),
            ('FONTNAME', (0,3), (-1,3), 'Helvetica-Bold'),
            ('FONTNAME', (0,5), (-1,5), 'Helvetica-Bold'),
            ('TEXTCOLOR', (0,5), (-1,5), colors.HexColor('#2563EB')),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        elements.append(summary_table)

        doc.build(elements)
        buffer.seek(0)
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{invoice.invoice_number}.pdf"'
        return response

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        invoice = self.get_object()

        if invoice.status == Invoice.Status.PAID or invoice.balance <= Decimal('0.00'):
            return Response({'error': 'Invoice is already paid in full'}, status=status.HTTP_400_BAD_REQUEST)

        raw_amount = request.data.get('amount', invoice.balance)
        try:
            amount = Decimal(str(raw_amount))
        except Exception:
            return Response({'error': 'Invalid amount format'}, status=status.HTTP_400_BAD_REQUEST)

        if amount <= Decimal('0.00'):
            return Response({'error': 'Payment amount must be greater than zero'}, status=status.HTTP_400_BAD_REQUEST)

        if amount > invoice.balance:
            return Response({'error': 'Payment amount cannot exceed remaining invoice balance'}, status=status.HTTP_400_BAD_REQUEST)

        method = request.data.get('method', Payment.Method.CARD)
        if method not in Payment.Method.values:
            return Response({'error': 'Invalid payment method'}, status=status.HTTP_400_BAD_REQUEST)

        reference = request.data.get('reference', 'TXN-ONLINE')

        with transaction.atomic():
            Payment.objects.create(
                invoice=invoice,
                amount=amount,
                method=method,
                reference=reference,
                recorded_by=request.user if request.user.is_authenticated else None
            )

            invoice.amount_paid += amount
            if invoice.amount_paid >= invoice.total:
                invoice.status = Invoice.Status.PAID
            elif invoice.amount_paid > 0:
                invoice.status = Invoice.Status.PARTIALLY_PAID
            invoice.save()

            Notification.objects.create(
                user=invoice.project.client,
                type='payment_received',
                payload={
                    'invoice_id': invoice.id,
                    'invoice_number': invoice.invoice_number,
                    'amount': float(amount),
                    'method': method,
                    'reference': reference
                }
            )

        serializer = self.get_serializer(invoice)
        return Response(serializer.data, status=status.HTTP_200_OK)


class InvoiceItemViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceItemSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated(), IsInvoiceAccessAllowed()]
        return [IsStaff()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return InvoiceItem.objects.none()
        if user.is_admin or user.is_staff_member:
            return InvoiceItem.objects.all()
        if user.is_client:
            return InvoiceItem.objects.filter(invoice__project__client=user)
        return InvoiceItem.objects.none()


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated(), IsInvoiceAccessAllowed()]
        return [IsStaff()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Payment.objects.none()
        if user.is_admin or user.is_staff_member:
            return Payment.objects.all().order_by('-paid_at')
        if user.is_client:
            return Payment.objects.filter(invoice__project__client=user).order_by('-paid_at')
        return Payment.objects.none()
