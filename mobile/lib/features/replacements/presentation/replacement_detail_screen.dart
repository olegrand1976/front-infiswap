import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';
import '../models/replacement_item.dart';
import 'widgets/mission_avatar.dart';

class ReplacementDetailScreen extends StatelessWidget {
  const ReplacementDetailScreen({
    super.key,
    required this.item,
  });

  final ReplacementItem item;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, 16, 0),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: Icon(
                      Icons.arrow_back,
                      color: colors.primary,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      item.isMission
                          ? 'Détail de la mission'
                          : 'Détail du remplacement',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: colors.textPrimary,
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
            ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                children: [
                  if (item.isMission)
                    _MissionHeader(item: item)
                  else
                    _SimpleHeader(item: item),
                  const SizedBox(height: 12),
                  _PeriodsCard(periods: item.periods),
                  const SizedBox(height: 12),
                  _LocationDetailCard(item: item),
                  if (item.careTypes.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    _InfoCard(
                      icon: Icons.favorite_border,
                      label: 'TYPES DE SOINS',
                      child: Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: item.careTypes
                            .map((care) => _CareChip(label: care))
                            .toList(),
                      ),
                    ),
                  ],
                  if (item.isMission) ...[
                    const SizedBox(height: 12),
                    _InfoCard(
                      icon: Icons.school_outlined,
                      label: 'DIPLÔME',
                      child: Text(
                        item.role,
                        style: TextStyle(
                          color: colors.textPrimary,
                          fontSize: 15,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                  if (item.description.trim().isNotEmpty) ...[
                    const SizedBox(height: 12),
                    _InfoCard(
                      icon: Icons.description_outlined,
                      label: 'DESCRIPTION',
                      child: Text(
                        item.description,
                        style: TextStyle(
                          color: colors.textPrimary,
                          fontSize: 14,
                          height: 1.45,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Text('Candidature bientôt disponible'),
                        backgroundColor: colors.card,
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colors.primary,
                    foregroundColor: colors.onPrimary,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(28),
                    ),
                  ),
                  child: const Text(
                    'Je suis intéressé(e)',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SimpleHeader extends StatelessWidget {
  const _SimpleHeader({required this.item});

  final ReplacementItem item;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              if (item.isBoosted) const _BoostStars(),
              const Spacer(),
              if (item.isUrgent) const _UrgentBadge(),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            item.title,
            style: TextStyle(
              color: colors.textPrimary,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            item.subtitle,
            style: TextStyle(
              color: colors.textSecondary,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Icon(
                Icons.pin_drop_outlined,
                size: 16,
                color: colors.primary,
              ),
              const SizedBox(width: 4),
              Flexible(
                child: Text(
                  item.zipCodesLabel,
                  style: TextStyle(
                    color: colors.textSecondary,
                    fontSize: 13,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Container(
                width: 1,
                height: 14,
                color: colors.textSecondary.withValues(alpha: 0.4),
              ),
              const SizedBox(width: 10),
              Icon(
                Icons.calendar_today_outlined,
                size: 14,
                color: colors.primary,
              ),
              const SizedBox(width: 4),
              Flexible(
                child: Text(
                  item.dateLabel,
                  style: TextStyle(
                    color: colors.textSecondary,
                    fontSize: 13,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _MissionHeader extends StatelessWidget {
  const _MissionHeader({required this.item});

  final ReplacementItem item;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Column(
      children: [
        if (item.isBoosted) ...[
          const _BoostStars(),
          const SizedBox(height: 12),
        ],
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              MissionAvatar(logoUrl: item.institutionLogoUrl, size: 48),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'INSTITUTION',
                      style: TextStyle(
                        color: colors.textSecondary,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.6,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      item.institutionName ?? 'Institution',
                      style: TextStyle(
                        color: colors.textPrimary,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              if (item.isUrgent) const _UrgentBadge(),
            ],
          ),
        ),
      ],
    );
  }
}

class _LocationDetailCard extends StatelessWidget {
  const _LocationDetailCard({required this.item});

  final ReplacementItem item;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: colors.primary.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.pin_drop_outlined,
                  size: 18,
                  color: colors.primary,
                ),
              ),
              const SizedBox(width: 12),
              Text(
                'CODES POSTAUX',
                style: TextStyle(
                  color: colors.textSecondary,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.6,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (item.zipCodes.isEmpty)
            Text(
              'Aucun code postal',
              style: TextStyle(color: colors.textSecondary, fontSize: 14),
            )
          else
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: item.zipCodes
                  .map((zip) => _LocationChip(label: zip, emphasized: true))
                  .toList(),
            ),
          const SizedBox(height: 16),
          const Divider(color: Color(0xFF1E293B), height: 1),
          const SizedBox(height: 16),
          Row(
            children: [
              Icon(
                Icons.location_city_outlined,
                size: 18,
                color: colors.primary,
              ),
              const SizedBox(width: 8),
              Text(
                'VILLES',
                style: TextStyle(
                  color: colors.textSecondary,
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.6,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (item.cities.isEmpty)
            Text(
              'Aucune ville',
              style: TextStyle(color: colors.textSecondary, fontSize: 14),
            )
          else
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: item.cities
                  .map((city) => _LocationChip(label: city))
                  .toList(),
            ),
        ],
      ),
    );
  }
}

class _LocationChip extends StatelessWidget {
  const _LocationChip({
    required this.label,
    this.emphasized = false,
  });

  final String label;
  final bool emphasized;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: emphasized
            ? colors.primary.withValues(alpha: 0.12)
            : colors.background,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: emphasized
              ? colors.primary.withValues(alpha: 0.45)
              : colors.textSecondary.withValues(alpha: 0.25),
        ),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: emphasized ? colors.primary : colors.textPrimary,
          fontSize: 13,
          fontWeight: emphasized ? FontWeight.w600 : FontWeight.w400,
        ),
      ),
    );
  }
}

class _PeriodsCard extends StatelessWidget {
  const _PeriodsCard({required this.periods});

  final List<ReplacementPeriod> periods;

  @override
  Widget build(BuildContext context) {
    return _InfoCard(
      icon: Icons.calendar_today_outlined,
      label: 'PÉRIODES',
      child: Column(
        children: [
          for (var i = 0; i < periods.length; i++) ...[
            if (i > 0) const Divider(color: Color(0xFF1E293B), height: 20),
            _PeriodRow(period: periods[i]),
          ],
        ],
      ),
    );
  }
}

class _PeriodRow extends StatelessWidget {
  const _PeriodRow({required this.period});

  final ReplacementPeriod period;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              Icons.event_outlined,
              size: 16,
              color: colors.textSecondary,
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                period.dateLabel,
                style: TextStyle(
                  color: colors.textPrimary,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
        if (period.morning != null || period.evening != null) ...[
          const SizedBox(height: 10),
          if (period.morning != null)
            _ShiftLine(
              icon: Icons.wb_sunny_outlined,
              label: 'Matin',
              value: period.morning!,
            ),
          if (period.morning != null && period.evening != null)
            const SizedBox(height: 8),
          if (period.evening != null)
            _ShiftLine(
              icon: Icons.nightlight_round,
              label: 'Soir',
              value: period.evening!,
            ),
        ],
      ],
    );
  }
}

class _ShiftLine extends StatelessWidget {
  const _ShiftLine({
    required this.icon,
    required this.label,
    required this.value,
  });

  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: colors.background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colors.primary.withValues(alpha: 0.35)),
      ),
      child: Row(
        children: [
          Icon(icon, size: 16, color: colors.primary),
          const SizedBox(width: 8),
          Text(
            label,
            style: TextStyle(
              color: colors.primary,
              fontWeight: FontWeight.w600,
            ),
          ),
          const Spacer(),
          Text(
            value,
            style: TextStyle(color: colors.textPrimary),
          ),
        ],
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.icon,
    required this.label,
    required this.child,
  });

  final IconData icon;
  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: colors.primary.withValues(alpha: 0.12),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 18, color: colors.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    color: colors.textSecondary,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    letterSpacing: 0.6,
                  ),
                ),
                const SizedBox(height: 8),
                child,
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _CareChip extends StatelessWidget {
  const _CareChip({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.primary.withValues(alpha: 0.5)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: colors.primary,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}

class _BoostStars extends StatelessWidget {
  const _BoostStars();

  @override
  Widget build(BuildContext context) {
    return const Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(Icons.star, size: 18, color: Color(0xFFFBBF24)),
        Icon(Icons.star, size: 18, color: Color(0xFFFBBF24)),
        Icon(Icons.star, size: 18, color: Color(0xFFFBBF24)),
        Icon(Icons.star, size: 18, color: Color(0xFFFBBF24)),
        Icon(Icons.star, size: 18, color: Color(0xFFFBBF24)),
      ],
    );
  }
}

class _UrgentBadge extends StatelessWidget {
  const _UrgentBadge();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.coral,
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.campaign_outlined, size: 12, color: Colors.white),
          SizedBox(width: 4),
          Text(
            'Urgent',
            style: TextStyle(
              color: Colors.white,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
