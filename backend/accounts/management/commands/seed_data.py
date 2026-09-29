from decimal import Decimal
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from accounts.models import User, ClientProfile, StaffProfile
from services.models import Service, MilestoneTemplate
from projects.models import Project, ProjectMember, ProgressUpdate
from milestones.models import Milestone, Task
from invoices.models import Invoice, InvoiceItem, Payment
from feedback.models import Feedback, FeedbackResponse
from notifications.models import Notification


class Command(BaseCommand):
    help = 'Seeds initial demo data for CPMTS'

    def handle(self, *args, **options):
        self.stdout.write("Seeding demo data...")

        # 1. Users
        admin, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@agency.com',
                'first_name': 'Elena',
                'last_name': 'Rostova',
                'role': User.Role.ADMIN,
                'phone': '+1 (212) 849-0193',
                'is_staff': True,
                'is_superuser': True
            }
        )
        admin.set_password('password123')
        admin.save()

        marcus, _ = User.objects.get_or_create(
            username='marcus',
            defaults={
                'email': 'marcus@agency.com',
                'first_name': 'Marcus',
                'last_name': 'Chen',
                'role': User.Role.STAFF,
                'phone': '+1 (212) 555-0101',
                'is_staff': True
            }
        )
        marcus.set_password('password123')
        marcus.save()
        StaffProfile.objects.get_or_create(user=marcus, defaults={'title': 'Lead System Architect'})

        sarah_staff, _ = User.objects.get_or_create(
            username='sarah_staff',
            defaults={
                'email': 'sarah.lin@agency.com',
                'first_name': 'Sarah',
                'last_name': 'Lin',
                'role': User.Role.STAFF,
                'phone': '+1 (212) 555-0102',
                'is_staff': True
            }
        )
        sarah_staff.set_password('password123')
        sarah_staff.save()
        StaffProfile.objects.get_or_create(user=sarah_staff, defaults={'title': 'Design Systems Lead'})

        client_aura, _ = User.objects.get_or_create(
            username='client_aura',
            defaults={
                'email': 'client@aura.io',
                'first_name': 'Sarah',
                'last_name': 'Jenkins',
                'role': User.Role.CLIENT,
                'phone': '+1 (415) 555-9081'
            }
        )
        client_aura.set_password('password123')
        client_aura.save()
        ClientProfile.objects.get_or_create(user=client_aura, defaults={'company_name': 'Aura Fintech'})

        client_solace, _ = User.objects.get_or_create(
            username='client_solace',
            defaults={
                'email': 'client@solace.health',
                'first_name': 'Dr. Amara',
                'last_name': 'Vance',
                'role': User.Role.CLIENT,
                'phone': '+1 (650) 555-3211'
            }
        )
        client_solace.set_password('password123')
        client_solace.save()
        ClientProfile.objects.get_or_create(user=client_solace, defaults={'company_name': 'Solace Health Systems'})

        # 2. Services
        service1, _ = Service.objects.get_or_create(
            name='Enterprise Web & Mobile App Ecosystem',
            defaults={
                'description': 'Turnkey engineering of resilient multi-tenant client portals and micro-frontends.',
                'is_active': True
            }
        )
        MilestoneTemplate.objects.get_or_create(service=service1, name='UX Discovery & Brand Architecture', defaults={'order': 1})
        MilestoneTemplate.objects.get_or_create(service=service1, name='Wireframes & Interactive Prototypes', defaults={'order': 2})
        MilestoneTemplate.objects.get_or_create(service=service1, name='Design System & Component Library', defaults={'order': 3})
        MilestoneTemplate.objects.get_or_create(service=service1, name='Full-Stack React/Next.js Build & API Integration', defaults={'order': 4})
        MilestoneTemplate.objects.get_or_create(service=service1, name='Security Audit & Production Launch', defaults={'order': 5})

        service2, _ = Service.objects.get_or_create(
            name='Brand Identity & Design System',
            defaults={
                'description': 'Executive brand positioning, complete vector logomark systems, and color codex.',
                'is_active': True
            }
        )

        service3, _ = Service.objects.get_or_create(
            name='Interactive 3D WebGL & Motion Experience',
            defaults={
                'description': 'High-performance Three.js pipelines and custom GLSL vertex shaders.',
                'is_active': True
            }
        )

        # 3. Projects
        project_aura, _ = Project.objects.get_or_create(
            name='Aura Fintech — Global Brand & Web App',
            defaults={
                'client': client_aura,
                'service': service1,
                'description': 'End-to-end design token synchronization, scalable multi-currency transaction dashboard.',
                'start_date': date.today() - timedelta(days=30),
                'deadline': date.today() + timedelta(days=30),
                'budget': Decimal('45000.00'),
                'status': Project.Status.IN_PROGRESS,
                'progress_percent': 78
            }
        )
        ProjectMember.objects.get_or_create(project=project_aura, staff=marcus, defaults={'is_lead': True})
        ProjectMember.objects.get_or_create(project=project_aura, staff=sarah_staff, defaults={'is_lead': False})

        project_solace, _ = Project.objects.get_or_create(
            name='Solace Health — Multi-Brand System',
            defaults={
                'client': client_solace,
                'service': service2,
                'description': 'Telehealth UX architecture and identity design system.',
                'start_date': date.today() - timedelta(days=20),
                'deadline': date.today() + timedelta(days=40),
                'budget': Decimal('32000.00'),
                'status': Project.Status.UNDER_REVIEW,
                'progress_percent': 60
            }
        )

        # 4. Progress Updates
        ProgressUpdate.objects.get_or_create(
            project=project_aura,
            note='Pushed React component tokens into master staging build.',
            defaults={'author': marcus}
        )

        # 5. Milestones & Tasks
        m1, _ = Milestone.objects.get_or_create(
            project=project_aura,
            name='UX Discovery & Brand Architecture',
            defaults={'order': 1, 'state': Milestone.State.DONE}
        )
        m2, _ = Milestone.objects.get_or_create(
            project=project_aura,
            name='Wireframes & Interactive Prototypes',
            defaults={'order': 2, 'state': Milestone.State.DONE}
        )
        m3, _ = Milestone.objects.get_or_create(
            project=project_aura,
            name='Design System & Component Library',
            defaults={'order': 3, 'state': Milestone.State.DONE}
        )
        m4, _ = Milestone.objects.get_or_create(
            project=project_aura,
            name='Full-Stack Build & API Integration',
            defaults={'order': 4, 'state': Milestone.State.IN_PROGRESS}
        )

        Task.objects.get_or_create(project=project_aura, milestone=m4, title='Stripe Checkout & Webhook Setup', defaults={'is_done': True})
        Task.objects.get_or_create(project=project_aura, milestone=m4, title='OAuth 2.0 Auth & Session Refresh', defaults={'is_done': True})
        Task.objects.get_or_create(project=project_aura, milestone=m4, title='Real-Time Finance Graph Visualizer', defaults={'is_done': True})
        Task.objects.get_or_create(project=project_aura, milestone=m4, title='M-Pesa Webhook & FX Sync', defaults={'is_done': False})

        # 6. Invoices
        inv1, _ = Invoice.objects.get_or_create(
            invoice_number='INV-2024-089',
            defaults={
                'project': project_aura,
                'issue_date': date.today() - timedelta(days=5),
                'due_date': date.today() + timedelta(days=10),
                'subtotal': Decimal('12500.00'),
                'tax': Decimal('0.00'),
                'discount': Decimal('0.00'),
                'total': Decimal('12500.00'),
                'amount_paid': Decimal('0.00'),
                'status': Invoice.Status.UNPAID
            }
        )
        InvoiceItem.objects.get_or_create(invoice=inv1, description='Milestone 3 & 4 Settlement', defaults={'quantity': 1, 'unit_price': Decimal('12500.00')})

        inv2, _ = Invoice.objects.get_or_create(
            invoice_number='INV-2024-088',
            defaults={
                'project': project_solace,
                'issue_date': date.today() - timedelta(days=15),
                'due_date': date.today() - timedelta(days=2),
                'subtotal': Decimal('34000.00'),
                'tax': Decimal('0.00'),
                'discount': Decimal('0.00'),
                'total': Decimal('34000.00'),
                'amount_paid': Decimal('34000.00'),
                'status': Invoice.Status.PAID
            }
        )
        InvoiceItem.objects.get_or_create(invoice=inv2, description='Telehealth UX Architecture Settlement', defaults={'quantity': 1, 'unit_price': Decimal('34000.00')})
        Payment.objects.get_or_create(invoice=inv2, amount=Decimal('34000.00'), defaults={'method': Payment.Method.CARD, 'reference': 'WIRE-SOL-998', 'recorded_by': admin})

        # 7. Notifications & Feedback
        Notification.objects.get_or_create(
            user=admin,
            type='urgent',
            defaults={
                'payload': {
                    'title': 'Milestone Review Requested',
                    'content': 'Mobile Checkout & Escrow validation completed.',
                    'sla': 'SLA: 2h Remaining'
                }
            }
        )

        fb, _ = Feedback.objects.get_or_create(
            project=project_aura,
            sender=client_aura,
            message='The latest iteration of the Multi-Currency Wallet dashboard looks stellar!',
            defaults={'status': Feedback.Status.PENDING}
        )
        FeedbackResponse.objects.get_or_create(
            feedback=fb,
            responder=marcus,
            defaults={'message': 'Thank you Sarah! We have pushed the corresponding React component tokens into staging.'}
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded demo data!"))
