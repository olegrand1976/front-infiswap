import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';

class _ReplacementPreview {
  const _ReplacementPreview({
    required this.location,
    required this.date,
    required this.title,
    required this.subtitle,
    this.isUrgent = false,
  });

  final String location;
  final String date;
  final String title;
  final String subtitle;
  final bool isUrgent;
}

class ReplacementsScreen extends StatelessWidget {
  const ReplacementsScreen({super.key});

  static const List<_ReplacementPreview> _items = [
    _ReplacementPreview(
      location: 'Bruxelles, 1000',
      date: '12 juil. 2026 · 08:00 – 16:00',
      title: 'Remplacement cabinet infirmier',
      subtitle: 'Soins à domicile · Temps plein',
      isUrgent: true,
    ),
    _ReplacementPreview(
      location: 'Liège, 4000',
      date: '15 juil. 2026 · 09:00 – 17:00',
      title: 'Remplacement maison de repos',
      subtitle: 'Équipe de jour · 3 jours',
    ),
    _ReplacementPreview(
      location: 'Namur, 5000',
      date: '18 juil. 2026 · 14:00 – 22:00',
      title: 'Remplacement hôpital de jour',
      subtitle: 'Service polyvalent',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: _ScreenTitle(title: 'Remplacements'),
            ),
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                itemCount: _items.length,
                separatorBuilder: (_, __) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  return _ReplacementCard(item: _items[index]);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ScreenTitle extends StatelessWidget {
  const _ScreenTitle({required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 28,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: 48,
          height: 3,
          decoration: BoxDecoration(
            color: AppColors.mint,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
      ],
    );
  }
}

class _ReplacementCard extends StatelessWidget {
  const _ReplacementCard({required this.item});

  final _ReplacementPreview item;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(12),
      ),
      clipBehavior: Clip.antiAlias,
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(width: 3, color: AppColors.mint),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(10, 10, 10, 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            children: [
                              _MetaRow(
                                icon: Icons.location_on_outlined,
                                text: item.location,
                              ),
                              const SizedBox(height: 4),
                              _MetaRow(
                                icon: Icons.calendar_today_outlined,
                                text: item.date,
                              ),
                            ],
                          ),
                        ),
                        if (item.isUrgent) ...[
                          const SizedBox(width: 6),
                          const _UrgentBadge(),
                        ],
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      item.title,
                      style: const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      item.subtitle,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MetaRow extends StatelessWidget {
  const _MetaRow({
    required this.icon,
    required this.text,
  });

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppColors.textSecondary),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(
              color: AppColors.textSecondary,
              fontSize: 12,
            ),
          ),
        ),
      ],
    );
  }
}

class _UrgentBadge extends StatelessWidget {
  const _UrgentBadge();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.coral,
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.campaign_outlined, size: 12, color: Colors.white),
          SizedBox(width: 3),
          Text(
            'Urgent',
            style: TextStyle(
              color: Colors.white,
              fontSize: 10,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
