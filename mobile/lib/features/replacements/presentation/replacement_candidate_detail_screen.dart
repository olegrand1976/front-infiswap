import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../data/replacement_candidates_notifier.dart';
import '../models/replacement_candidate.dart';
import '../models/replacement_item.dart';

class ReplacementCandidateDetailScreen extends ConsumerWidget {
  const ReplacementCandidateDetailScreen({
    super.key,
    required this.item,
    required this.candidate,
  });

  final ReplacementItem item;
  final ReplacementCandidate candidate;

  int get _replacementId => int.tryParse(item.id) ?? 0;

  ReplacementCandidate _resolve(WidgetRef ref) {
    final list = ref.watch(replacementCandidatesProvider(_replacementId)).valueOrNull;
    if (list == null) {
      return candidate;
    }
    for (final entry in list) {
      if (entry.responseId == candidate.responseId) {
        return entry;
      }
    }
    return candidate;
  }

  Future<void> _confirmAndUpdate(
    BuildContext context,
    WidgetRef ref, {
    required ReplacementCandidate target,
    required String status,
    required String title,
    required String message,
    required String confirmLabel,
    required Color confirmColor,
  }) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) {
        final colors = dialogContext.appColors;
        return AlertDialog(
          backgroundColor: colors.card,
          title: Text(title, style: TextStyle(color: colors.textPrimary)),
          content: Text(message, style: TextStyle(color: colors.textSecondary)),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(false),
              child: Text('Annuler', style: TextStyle(color: colors.textSecondary)),
            ),
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(true),
              child: Text(confirmLabel, style: TextStyle(color: confirmColor, fontWeight: FontWeight.w700)),
            ),
          ],
        );
      },
    );

    if (confirmed != true || !context.mounted) {
      return;
    }

    try {
      await ref
          .read(replacementCandidatesProvider(_replacementId).notifier)
          .updateStatus(target.responseId, status);
    } on ApiException catch (error) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.message)));
    } catch (_) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Une erreur est survenue.')),
      );
    }
  }

  Future<void> _call(String phone) => launchUrl(Uri(scheme: 'tel', path: phone));

  Future<void> _email(String email) => launchUrl(Uri(scheme: 'mailto', path: email));

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;
    final current = _resolve(ref);
    final bucket = replacementCandidateBucket(current.status);

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
                    icon: Icon(Icons.arrow_back, color: colors.primary),
                  ),
                  Expanded(
                    child: Text(
                      'Profil du candidat',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: colors.textPrimary, fontSize: 17, fontWeight: FontWeight.w700),
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
                  _Hero(candidate: current),
                  const SizedBox(height: 14),
                  _StatsStrip(candidate: current),
                  const SizedBox(height: 12),
                  if (current.comment != null && current.comment!.isNotEmpty)
                    _InfoCard(
                      icon: Icons.chat_bubble_outline,
                      label: 'MESSAGE DE CANDIDATURE',
                      highlighted: true,
                      child: Text(
                        '« ${current.comment} »',
                        style: TextStyle(color: colors.textPrimary, fontSize: 13, height: 1.5),
                      ),
                    ),
                  if (current.bio != null && current.bio!.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    _InfoCard(
                      icon: Icons.person_outline,
                      label: 'À PROPOS',
                      child: Text(
                        current.bio!,
                        style: TextStyle(color: colors.textPrimary, fontSize: 13, height: 1.5),
                      ),
                    ),
                  ],
                  if (current.skills.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    _InfoCard(
                      icon: Icons.medical_information_outlined,
                      label: 'COMPÉTENCES',
                      child: Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: current.skills.map((skill) => _SkillChip(label: skill)).toList(),
                      ),
                    ),
                  ],
                  if (current.respondentCity != null || current.respondentZipCode != null) ...[
                    const SizedBox(height: 12),
                    _InfoCard(
                      icon: Icons.pin_drop_outlined,
                      label: 'LOCALISATION',
                      child: Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          _LocationChip(
                            label: [
                              if (current.respondentZipCode != null) current.respondentZipCode!,
                              if (current.respondentCity != null) current.respondentCity!,
                            ].join(' · '),
                          ),
                        ],
                      ),
                    ),
                  ],
                  if (current.respondentPhone != null ||
                      current.respondentEmail != null ||
                      current.identifierNumber != null) ...[
                    const SizedBox(height: 12),
                    _InfoCard(
                      icon: Icons.contact_page_outlined,
                      label: 'CONTACT',
                      child: Column(
                        children: [
                          if (current.respondentPhone != null)
                            _ContactRow(
                              icon: Icons.call_outlined,
                              label: 'Téléphone',
                              value: current.respondentPhone!,
                              onTap: () => _call(current.respondentPhone!),
                            ),
                          if (current.respondentEmail != null)
                            _ContactRow(
                              icon: Icons.mail_outline,
                              label: 'E-mail',
                              value: current.respondentEmail!,
                              onTap: () => _email(current.respondentEmail!),
                            ),
                          if (current.identifierNumber != null)
                            _ContactRow(
                              icon: Icons.badge_outlined,
                              label: 'N° INAMI',
                              value: current.identifierNumber!,
                            ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: _Footer(
                bucket: bucket,
                candidate: current,
                onAccept: () => _confirmAndUpdate(
                  context,
                  ref,
                  target: current,
                  status: 'confirmed',
                  title: 'Accepter cette candidature ?',
                  message:
                      '${current.respondentName} sera confirmé(e) pour ce remplacement. Les autres candidatures restent consultables.',
                  confirmLabel: 'Accepter',
                  confirmColor: AppColors.mint,
                ),
                onRefuse: () => _confirmAndUpdate(
                  context,
                  ref,
                  target: current,
                  status: 'refused',
                  title: 'Refuser cette candidature ?',
                  message: '${current.respondentName} sera notifié(e) du refus.',
                  confirmLabel: 'Refuser',
                  confirmColor: AppColors.coral,
                ),
                onCancelAcceptance: () => _confirmAndUpdate(
                  context,
                  ref,
                  target: current,
                  status: 'canceled',
                  title: "Annuler l'acceptation ?",
                  message:
                      'Le remplacement redevient ouvert et ${current.respondentName} sera notifié(e).',
                  confirmLabel: "Annuler l'acceptation",
                  confirmColor: AppColors.coral,
                ),
                onReexamine: () => ref
                    .read(replacementCandidatesProvider(_replacementId).notifier)
                    .updateStatus(current.responseId, 'pending'),
                onCall: current.respondentPhone != null ? () => _call(current.respondentPhone!) : null,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Hero extends StatelessWidget {
  const _Hero({required this.candidate});

  final ReplacementCandidate candidate;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    const palette = AppColors.avatarPalette;
    final (bg, fg) = palette[candidate.respondentName.hashCode.abs() % palette.length];

    return Column(
      children: [
        Container(
          width: 74,
          height: 74,
          alignment: Alignment.center,
          decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(22)),
          child: Text(
            candidate.initials,
            style: TextStyle(color: fg, fontSize: 24, fontWeight: FontWeight.w800),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              candidate.respondentName,
              style: TextStyle(color: colors.textPrimary, fontSize: 18, fontWeight: FontWeight.w800),
            ),
            if (candidate.isVerified) ...[
              const SizedBox(width: 6),
              Icon(Icons.verified, size: 17, color: colors.successFg),
            ],
          ],
        ),
        if (candidate.respondentCity != null || candidate.distanceKm != null) ...[
          const SizedBox(height: 6),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.pin_drop_outlined, size: 13, color: colors.primary),
              const SizedBox(width: 4),
              Text(
                [
                  if (candidate.respondentCity != null) candidate.respondentCity!,
                  if (candidate.distanceKm != null) 'à ${candidate.distanceKm!.toStringAsFixed(1)} km',
                ].join(' · '),
                style: TextStyle(color: colors.textSecondary, fontSize: 12),
              ),
            ],
          ),
        ],
      ],
    );
  }
}

class _StatsStrip extends StatelessWidget {
  const _StatsStrip({required this.candidate});

  final ReplacementCandidate candidate;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final availabilityLabel = replacementCandidateAvailabilityLabel(candidate.availability);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 13),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.border),
        boxShadow: [
          BoxShadow(color: colors.shadow, blurRadius: 10, offset: const Offset(0, 3)),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: _StatCell(
              value: (candidate.completedReplacementsCount ?? 0).toString(),
              label: 'REMPLACEMENTS',
              color: colors.textPrimary,
            ),
          ),
          _StatDivider(color: colors.divider),
          Expanded(
            child: _StatCell(
              value: _seniorityLabel(candidate.memberSince),
              label: 'ANCIENNETÉ',
              color: colors.textPrimary,
            ),
          ),
          _StatDivider(color: colors.divider),
          Expanded(
            child: availabilityLabel != null
                ? _AvailabilityCell(label: availabilityLabel, availability: candidate.availability!)
                : _StatCell(value: '—', label: 'DISPONIBILITÉ', color: colors.textSecondary),
          ),
        ],
      ),
    );
  }

  static String _seniorityLabel(DateTime? memberSince) {
    if (memberSince == null) {
      return '—';
    }
    final days = DateTime.now().difference(memberSince).inDays;
    if (days >= 365) {
      final years = days ~/ 365;
      return '$years an${years > 1 ? 's' : ''}';
    }
    if (days >= 30) {
      final months = days ~/ 30;
      return '$months mois';
    }
    return '< 1 mois';
  }
}

class _StatCell extends StatelessWidget {
  const _StatCell({required this.value, required this.label, required this.color});

  final String value;
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          value,
          style: TextStyle(color: color, fontSize: 16, fontWeight: FontWeight.w800, height: 1),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(color: colors.textSecondary, fontSize: 8.5, fontWeight: FontWeight.w700, letterSpacing: .3),
        ),
      ],
    );
  }
}

class _AvailabilityCell extends StatelessWidget {
  const _AvailabilityCell({required this.label, required this.availability});

  final String label;
  final String availability;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final (bg, fg) = switch (availability) {
      'available' => (colors.successBg, colors.successFg),
      'busy' => (colors.pendingBg, colors.pendingFg),
      _ => (colors.dangerBg, colors.dangerFg),
    };

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(999)),
          child: Text(label, style: TextStyle(color: fg, fontSize: 10.5, fontWeight: FontWeight.w800)),
        ),
        const SizedBox(height: 5),
        Text(
          'DISPONIBILITÉ',
          textAlign: TextAlign.center,
          style: TextStyle(color: colors.textSecondary, fontSize: 8.5, fontWeight: FontWeight.w700, letterSpacing: .3),
        ),
      ],
    );
  }
}

class _StatDivider extends StatelessWidget {
  const _StatDivider({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(width: 1, margin: const EdgeInsets.symmetric(vertical: 2), color: color);
  }
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.icon,
    required this.label,
    required this.child,
    this.highlighted = false,
  });

  final IconData icon;
  final String label;
  final Widget child;
  final bool highlighted;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: highlighted ? colors.primaryMuted : colors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: highlighted ? colors.primaryOutline : colors.border),
        boxShadow: highlighted
            ? null
            : [BoxShadow(color: colors.shadow, blurRadius: 10, offset: const Offset(0, 3))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 15, color: colors.primary),
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  color: highlighted ? colors.primary : colors.textSecondary,
                  fontSize: 10.5,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          child,
        ],
      ),
    );
  }
}

class _SkillChip extends StatelessWidget {
  const _SkillChip({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.border),
      ),
      child: Text(label, style: TextStyle(color: colors.textPrimary, fontSize: 12, fontWeight: FontWeight.w500)),
    );
  }
}

class _LocationChip extends StatelessWidget {
  const _LocationChip({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: colors.primaryMuted,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: colors.primaryOutline),
      ),
      child: Text(label, style: TextStyle(color: colors.primary, fontSize: 13, fontWeight: FontWeight.w600)),
    );
  }
}

class _ContactRow extends StatelessWidget {
  const _ContactRow({
    required this.icon,
    required this.label,
    required this.value,
    this.onTap,
  });

  final IconData icon;
  final String label;
  final String value;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            alignment: Alignment.center,
            decoration: BoxDecoration(color: colors.background, borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, size: 15, color: colors.textSecondary),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(color: colors.textSecondary, fontSize: 9.5, fontWeight: FontWeight.w700, letterSpacing: .3)),
                Text(
                  value,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(color: colors.textPrimary, fontSize: 12.5, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
          if (onTap != null)
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: onTap,
                borderRadius: BorderRadius.circular(10),
                child: Container(
                  width: 32,
                  height: 32,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(border: Border.all(color: colors.border), borderRadius: BorderRadius.circular(10)),
                  child: Icon(icon, size: 14, color: colors.textPrimary),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _Footer extends StatelessWidget {
  const _Footer({
    required this.bucket,
    required this.candidate,
    required this.onAccept,
    required this.onRefuse,
    required this.onCancelAcceptance,
    required this.onReexamine,
    this.onCall,
  });

  final ReplacementCandidateBucket bucket;
  final ReplacementCandidate candidate;
  final VoidCallback onAccept;
  final VoidCallback onRefuse;
  final VoidCallback onCancelAcceptance;
  final VoidCallback onReexamine;
  final VoidCallback? onCall;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    switch (bucket) {
      case ReplacementCandidateBucket.pending:
        return Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: onRefuse,
                style: OutlinedButton.styleFrom(
                  foregroundColor: colors.dangerFg,
                  side: BorderSide(color: colors.dangerFg.withValues(alpha: 0.4)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text('Refuser', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              flex: 2,
              child: ElevatedButton(
                onPressed: onAccept,
                style: ElevatedButton.styleFrom(
                  backgroundColor: colors.primary,
                  foregroundColor: colors.onPrimary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text('Accepter la candidature', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        );
      case ReplacementCandidateBucket.accepted:
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
              decoration: BoxDecoration(color: colors.successBg, borderRadius: BorderRadius.circular(12)),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.check_circle, size: 16, color: colors.successFg),
                  const SizedBox(width: 6),
                  Text('Candidat retenu pour ce remplacement',
                      style: TextStyle(color: colors.successFg, fontSize: 12.5, fontWeight: FontWeight.w700)),
                ],
              ),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                if (onCall != null) ...[
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: onCall,
                      icon: Icon(Icons.call_outlined, size: 16, color: colors.textPrimary),
                      label: const Text('Appeler', style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w700)),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: colors.textPrimary,
                        side: BorderSide(color: colors.border),
                        padding: const EdgeInsets.symmetric(vertical: 13),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                ],
                Expanded(
                  child: OutlinedButton(
                    onPressed: onCancelAcceptance,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: colors.dangerFg,
                      side: BorderSide(color: colors.dangerFg.withValues(alpha: 0.4)),
                      padding: const EdgeInsets.symmetric(vertical: 13),
                    ),
                    child: const Text("Annuler l'acceptation", style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
                  ),
                ),
              ],
            ),
          ],
        );
      case ReplacementCandidateBucket.closed:
        return SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: onReexamine,
            style: OutlinedButton.styleFrom(
              foregroundColor: colors.textPrimary,
              side: BorderSide(color: colors.border),
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
            child: const Text('Réexaminer cette candidature', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
          ),
        );
    }
  }
}
