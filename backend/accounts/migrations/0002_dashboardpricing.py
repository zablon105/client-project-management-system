from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DashboardPricing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('min_price', models.IntegerField(default=12000)),
                ('max_price', models.IntegerField(default=24500)),
                ('currency', models.CharField(default='KSh', max_length=10)),
            ],
            options={
                'verbose_name': 'dashboard pricing',
                'verbose_name_plural': 'dashboard pricing',
            },
        ),
    ]
