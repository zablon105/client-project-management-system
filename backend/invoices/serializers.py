from rest_framework import serializers
from .models import Invoice, InvoiceItem, Payment


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'invoice', 'description', 'quantity', 'unit_price']


class PaymentSerializer(serializers.ModelSerializer):
    recorded_by_name = serializers.ReadOnlyField(source='recorded_by.get_full_name')

    class Meta:
        model = Payment
        fields = [
            'id', 'invoice', 'amount', 'method', 'reference',
            'recorded_by', 'recorded_by_name', 'paid_at'
        ]
        read_only_fields = ['id', 'paid_at']


class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    project_name = serializers.ReadOnlyField(source='project.name')
    client_name = serializers.ReadOnlyField(source='project.client.get_full_name')
    balance = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Invoice
        fields = [
            'id', 'project', 'project_name', 'client_name', 'invoice_number',
            'issue_date', 'due_date', 'subtotal', 'tax', 'discount', 'total',
            'amount_paid', 'balance', 'status', 'items', 'payments'
        ]
        read_only_fields = ['id', 'invoice_number']
