from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import User
from services.models import Service
from projects.models import Project
from invoices.models import Invoice, Payment


class InvoicesTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin_inv', email='admin@inv.com', password='Password123!', role=User.Role.ADMIN
        )
        self.staff = User.objects.create_user(
            username='staff_inv', email='staff@inv.com', password='Password123!', role=User.Role.STAFF
        )
        self.client_a = User.objects.create_user(
            username='client_a_inv', email='clienta@inv.com', password='Password123!', role=User.Role.CLIENT
        )
        self.client_b = User.objects.create_user(
            username='client_b_inv', email='clientb@inv.com', password='Password123!', role=User.Role.CLIENT
        )

        self.service = Service.objects.create(name='Billing Service', description='Service for billing tests')
        self.project_a = Project.objects.create(name='Proj A', client=self.client_a, service=self.service)
        self.project_b = Project.objects.create(name='Proj B', client=self.client_b, service=self.service)

        self.invoice_a = Invoice.objects.create(
            project=self.project_a,
            invoice_number='INV-1001',
            issue_date='2026-01-01',
            due_date='2026-02-01',
            subtotal=Decimal('1000.00'),
            tax=Decimal('100.00'),
            discount=Decimal('0.00'),
            total=Decimal('1100.00'),
            amount_paid=Decimal('0.00'),
            status=Invoice.Status.UNPAID
        )
        self.invoice_b = Invoice.objects.create(
            project=self.project_b,
            invoice_number='INV-1002',
            issue_date='2026-01-01',
            due_date='2026-02-01',
            subtotal=Decimal('500.00'),
            tax=Decimal('0.00'),
            discount=Decimal('0.00'),
            total=Decimal('500.00'),
            amount_paid=Decimal('500.00'),
            status=Invoice.Status.PAID
        )

    def test_invoice_isolation_and_pdf(self):
        self.client.force_authenticate(user=self.client_a)

        # Client A sees invoice A, not invoice B
        response = self.client.get(reverse('invoice-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results'] if isinstance(response.data, dict) and 'results' in response.data else response.data
        inv_ids = [inv['id'] for inv in results]
        self.assertIn(self.invoice_a.id, inv_ids)
        self.assertNotIn(self.invoice_b.id, inv_ids)

        # PDF download for invoice A (owned by Client A)
        pdf_url = reverse('invoice-pdf', args=[self.invoice_a.id])
        pdf_resp = self.client.get(pdf_url)
        self.assertEqual(pdf_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(pdf_resp['Content-Type'], 'application/pdf')

        # PDF download for invoice B (owned by Client B) returns 404 for Client A
        pdf_b_url = reverse('invoice-pdf', args=[self.invoice_b.id])
        pdf_b_resp = self.client.get(pdf_b_url)
        self.assertEqual(pdf_b_resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_invoice_access_permissions_are_explicit(self):
        self.client.force_authenticate(user=self.client_a)

        # A client can only access their own invoice details, not another client's invoice.
        other_invoice_url = reverse('invoice-detail', args=[self.invoice_b.id])
        response = self.client.get(other_invoice_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Staff can still access any invoice.
        self.client.force_authenticate(user=self.staff)
        staff_response = self.client.get(other_invoice_url)
        self.assertEqual(staff_response.status_code, status.HTTP_200_OK)

    def test_payment_validations(self):
        self.client.force_authenticate(user=self.client_a)
        pay_url = reverse('invoice-pay', args=[self.invoice_a.id])

        # Reject negative amount
        resp_neg = self.client.post(pay_url, {'amount': '-100.00'})
        self.assertEqual(resp_neg.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('greater than zero', resp_neg.data['error'])

        # Reject zero amount
        resp_zero = self.client.post(pay_url, {'amount': '0.00'})
        self.assertEqual(resp_zero.status_code, status.HTTP_400_BAD_REQUEST)

        # Reject overpayment (> 1100 balance)
        resp_over = self.client.post(pay_url, {'amount': '2000.00'})
        self.assertEqual(resp_over.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('cannot exceed remaining', resp_over.data['error'])

        # Reject invalid method
        resp_meth = self.client.post(pay_url, {'amount': '100.00', 'method': 'crypto_invalid'})
        self.assertEqual(resp_meth.status_code, status.HTTP_400_BAD_REQUEST)

        # Reject payment on already-paid invoice
        pay_paid_url = reverse('invoice-pay', args=[self.invoice_b.id])
        self.client.force_authenticate(user=self.client_b)
        resp_paid = self.client.post(pay_paid_url, {'amount': '50.00'})
        self.assertEqual(resp_paid.status_code, status.HTTP_400_BAD_REQUEST)

    def test_successful_payments(self):
        self.client.force_authenticate(user=self.client_a)
        pay_url = reverse('invoice-pay', args=[self.invoice_a.id])

        # Partial payment of 500
        resp_partial = self.client.post(pay_url, {'amount': '500.00', 'method': 'card'})
        self.assertEqual(resp_partial.status_code, status.HTTP_200_OK)
        self.invoice_a.refresh_from_db()
        self.assertEqual(self.invoice_a.amount_paid, Decimal('500.00'))
        self.assertEqual(self.invoice_a.status, Invoice.Status.PARTIALLY_PAID)
        self.assertEqual(self.invoice_a.balance, Decimal('600.00'))

        # Complete remaining payment of 600
        resp_full = self.client.post(pay_url, {'amount': '600.00', 'method': 'card'})
        self.assertEqual(resp_full.status_code, status.HTTP_200_OK)
        self.invoice_a.refresh_from_db()
        self.assertEqual(self.invoice_a.amount_paid, Decimal('1100.00'))
        self.assertEqual(self.invoice_a.status, Invoice.Status.PAID)
        self.assertEqual(self.invoice_a.balance, Decimal('0.00'))
