import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../data/replacement_candidates_notifier.dart';
import '../models/replacement_candidate.dart';
import '../models/replacement_item.dart';

enum _Filter { all, pending, accepted, closed }

class ReplacementCandidatesScreen extends ConsumerStatefulWidget {
  const ReplacementCandidatesScreen({super.key, required this.item});

  final ReplacementItem item;

  @override
  ConsumerState<ReplacementCandidatesScreen> createState() =>
      _ReplacementCandidatesScreenState();
}

class _ReplacementCandidatesScreenState
    extends ConsumerState<ReplacementCandidatesScreen> {
  _Filter _filter = _Filter.all;

  int get _replacementId => int.tryParse(widget.item.id) ?? 0;

  Future<void> _confirmAndUpdate({
    required ReplacementCandidate candidate,
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

    if (confirmed != true || !mounted) {
      return;
    }

    try {
      await ref
          .read(replacementCandidatesProvider(_replacementId).notifier)
          .updateStatus(candidate.responseId, status);
    } on ApiException catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.message)));
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Une erreur est survenue.')),
      );
    }
  }

  Future<void> _accept(ReplacementCandidate candidate) {
    return _confirmAndUpdate(
      candidate: candidate,
      status: 'confirmed',
      title: 'Accepter cette candidature ?',
      message:
          '${candidate.respondentName} sera confirmé(e) pour ce remplacement. Les autres candidatures restent consultables.',
      confirmLabel: 'Accepter',
      confirmColor: AppColors.mint,
    );
  }

  Future<void> _refuse(ReplacementCandidate candidate) {
    return _confirmAndUpdate(
      candidate: candidate,
      status: 'refused',
      title: 'Refuser cette candidature ?',
      message: '${candidate.respondentName} sera notifié(e) du refus.',
      confirmLabel: 'Refuser',
      confirmColor: AppColors.coral,
    );
  }

  Future<void> _cancelAcceptance(ReplacementCandidate candidate) {
    return _confirmAndUpdate(
      candidate: candidate,
      status: 'canceled',
      title: "Annuler l'acceptation ?",
      message:
          'Le remplacement redevient ouvert et ${candidate.respondentName} sera notifié(e).',
      confirmLabel: 'Annuler l\'acceptation',
      confirmColor: AppColors.coral,
    );
  }

  Future<void> _reexamine(ReplacementCandidate candidate) async {
    try {
      await ref
          .read(replacementCandidatesProvider(_replacementId).notifier)
          .updateStatus(candidate.responseId, 'pending');
    } on ApiException catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.message)));
    }
  }

  Future<void> _call(String phone) async {
    final uri = Uri(scheme: 'tel', path: phone);
    await launchUrl(uri);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final asyncCandidates = ref.watch(replacementCandidatesProvider(_replacementId));
    final notifier = ref.read(replacementCandidatesProvider(_replacementId).notifier);

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, 20, 4),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: Icon(Icons.arrow_back, color: colors.primary),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Intéressés',
                          style: TextStyle(
                            color: colors.textPrimary,
                            fontSize: 19,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        Text(
                          '${widget.item.role} · ${widget.item.dateLabel}',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(color: colors.textSecondary, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: asyncCandidates.when(
                loading: () => Center(child: CircularProgressIndicator(color: colors.primary)),
                error: (error, _) => _ErrorState(
                  message: error is ApiException
                      ? error.message
                      : 'Impossible de charger les candidatures.',
                  onRetry: notifier.refresh,
                ),
                data: (candidates) {
                  final counts = _countByBucket(candidates);
                  final filtered = _applyFilter(candidates, _filter);

                  return RefreshIndicator(
                    color: colors.primary,
                    onRefresh: notifier.refresh,
                    child: ListView(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
                      children: [
                        _FilterRow(
                          selected: _filter,
                          total: candidates.length,
                          counts: counts,
                          onSelected: (filter) => setState(() => _filter = filter),
                        ),
                        const SizedBox(height: 12),
                        if (filtered.isEmpty)
                          const _EmptyState()
                        else
                          for (final candidate in filtered) ...[
                            _CandidateCard(
                              candidate: candidate,
                              onAccept: () => _accept(candidate),
                              onRefuse: () => _refuse(candidate),
                              onCancelAcceptance: () => _cancelAcceptance(candidate),
                              onReexamine: () => _reexamine(candidate),
                              onCall: candidate.respondentPhone != null
                                  ? () => _call(candidate.respondentPhone!)
                                  : null,
                            ),
                            const SizedBox(height: 12),
                          ],
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  static Map<ReplacementCandidateBucket, int> _countByBucket(
    List<ReplacementCandidate> candidates,
  ) {
    final counts = {
      ReplacementCandidateBucket.pending: 0,
      ReplacementCandidateBucket.accepted: 0,
      ReplacementCandidateBucket.closed: 0,
    };
    for (final candidate in candidates) {
      final bucket = replacementCandidateBucket(candidate.status);
      counts[bucket] = (counts[bucket] ?? 0) + 1;
    }
    return counts;
  }

  static List<ReplacementCandidate> _applyFilter(
    List<ReplacementCandidate> candidates,
    _Filter filter,
  ) {
    if (filter == _Filter.all) {
      return candidates;
    }
    final bucket = switch (filter) {
      _Filter.pending => ReplacementCandidateBucket.pending,
      _Filter.accepted => ReplacementCandidateBucket.accepted,
      _Filter.closed => ReplacementCandidateBucket.closed,
      _Filter.all => throw StateError('unreachable'),
    };
    return candidates
        .where((candidate) => replacementCandidateBucket(candidate.status) == bucket)
        .toList();
  }
}

class _FilterRow extends StatelessWidget {
  const _FilterRow({
    required this.selected,
    required this.total,
    required this.counts,
    required this.onSelected,
  });

  final _Filter selected;
  final int total;
  final Map<ReplacementCandidateBucket, int> counts;
  final ValueChanged<_Filter> onSelected;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _FilterChip(
            label: 'Tous',
            count: total,
            selected: selected == _Filter.all,
            onTap: () => onSelected(_Filter.all),
          ),
          const SizedBox(width: 8),
          _FilterChip(
            label: 'En attente',
            count: counts[ReplacementCandidateBucket.pending] ?? 0,
            selected: selected == _Filter.pending,
            onTap: () => onSelected(_Filter.pending),
          ),
          const SizedBox(width: 8),
          _FilterChip(
            label: 'Acceptés',
            count: counts[ReplacementCandidateBucket.accepted] ?? 0,
            selected: selected == _Filter.accepted,
            onTap: () => onSelected(_Filter.accepted),
          ),
          const SizedBox(width: 8),
          _FilterChip(
            label: 'Refusés',
            count: counts[ReplacementCandidateBucket.closed] ?? 0,
            selected: selected == _Filter.closed,
            onTap: () => onSelected(_Filter.closed),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  const _FilterChip({
    required this.label,
    required this.count,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final int count;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(999),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: selected ? colors.primaryMuted : Colors.transparent,
            borderRadius: BorderRadius.circular(999),
            border: Border.all(color: selected ? colors.primaryOutline : colors.border),
          ),
          child: Text(
            '$label ($count)',
            style: TextStyle(
              color: selected ? colors.primary : colors.textSecondary,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ),
    );
  }
}

class _CandidateCard extends StatelessWidget {
  const _CandidateCard({
    required this.candidate,
    required this.onAccept,
    required this.onRefuse,
    required this.onCancelAcceptance,
    required this.onReexamine,
    this.onCall,
  });

  final ReplacementCandidate candidate;
  final VoidCallback onAccept;
  final VoidCallback onRefuse;
  final VoidCallback onCancelAcceptance;
  final VoidCallback onReexamine;
  final VoidCallback? onCall;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final bucket = replacementCandidateBucket(candidate.status);
    final (statusBg, statusFg) = switch (bucket) {
      ReplacementCandidateBucket.accepted => (colors.successBg, colors.successFg),
      ReplacementCandidateBucket.closed => (colors.dangerBg, colors.dangerFg),
      ReplacementCandidateBucket.pending => (colors.pendingBg, colors.pendingFg),
    };

    return Opacity(
      opacity: bucket == ReplacementCandidateBucket.closed ? 0.6 : 1,
      child: Container(
        padding: const EdgeInsets.fromLTRB(14, 14, 14, 12),
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: bucket == ReplacementCandidateBucket.accepted
                ? colors.successFg
                : colors.border,
            width: bucket == ReplacementCandidateBucket.accepted ? 1.4 : 1,
          ),
          boxShadow: [
            BoxShadow(color: colors.shadow, blurRadius: 10, offset: const Offset(0, 3)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _Avatar(name: candidate.respondentName, initials: candidate.initials),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        candidate.respondentName,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: colors.textPrimary,
                          fontSize: 13.5,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        _metaLine(candidate),
                        style: TextStyle(color: colors.textSecondary, fontSize: 11),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                  decoration: BoxDecoration(color: statusBg, borderRadius: BorderRadius.circular(999)),
                  child: Text(
                    candidate.statusLabel,
                    style: TextStyle(color: statusFg, fontSize: 9.5, fontWeight: FontWeight.w800),
                  ),
                ),
              ],
            ),
            if (candidate.comment != null && candidate.comment!.isNotEmpty) ...[
              const SizedBox(height: 10),
              Text(
                candidate.comment!,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(color: colors.textSecondary, fontSize: 12, height: 1.4),
              ),
            ],
            Padding(
              padding: const EdgeInsets.only(top: 11),
              child: Divider(color: colors.divider, height: 1),
            ),
            const SizedBox(height: 10),
            _ActionsRow(
              bucket: bucket,
              canViewContact: candidate.canViewContact,
              onAccept: onAccept,
              onRefuse: onRefuse,
              onCancelAcceptance: onCancelAcceptance,
              onReexamine: onReexamine,
              onCall: onCall,
            ),
          ],
        ),
      ),
    );
  }

  static String _metaLine(ReplacementCandidate candidate) {
    final parts = <String>[];
    if (candidate.distanceKm != null) {
      parts.add('${candidate.distanceKm!.toStringAsFixed(1)} km');
    } else if (candidate.respondentCity != null && candidate.respondentCity!.isNotEmpty) {
      parts.add(candidate.respondentCity!);
    }
    final relative = _relativeTime(candidate.respondedAt);
    if (relative != null) {
      parts.add(relative);
    }
    return parts.isEmpty ? '—' : parts.join(' · ');
  }

  static String? _relativeTime(DateTime? date) {
    if (date == null) {
      return null;
    }
    final diff = DateTime.now().difference(date);
    if (diff.inMinutes < 1) return "à l'instant";
    if (diff.inMinutes < 60) return 'il y a ${diff.inMinutes} min';
    if (diff.inHours < 24) return 'il y a ${diff.inHours} h';
    return 'il y a ${diff.inDays} j';
  }
}

class _Avatar extends StatelessWidget {
  const _Avatar({required this.name, required this.initials});

  final String name;
  final String initials;

  static const _palette = [
    (Color(0xFFEDE9FE), Color(0xFF6D28D9)),
    (Color(0xFFFEF3C7), Color(0xFFB45309)),
    (Color(0xFFD1FAE5), Color(0xFF047857)),
    (Color(0xFFFFE4E6), Color(0xFFB91C1C)),
    (Color(0xFFE2E8F0), Color(0xFF475569)),
  ];

  @override
  Widget build(BuildContext context) {
    final (bg, fg) = _palette[name.hashCode.abs() % _palette.length];

    return Container(
      width: 42,
      height: 42,
      alignment: Alignment.center,
      decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(13)),
      child: Text(
        initials,
        style: TextStyle(color: fg, fontSize: 14, fontWeight: FontWeight.w800),
      ),
    );
  }
}

class _ActionsRow extends StatelessWidget {
  const _ActionsRow({
    required this.bucket,
    required this.canViewContact,
    required this.onAccept,
    required this.onRefuse,
    required this.onCancelAcceptance,
    required this.onReexamine,
    this.onCall,
  });

  final ReplacementCandidateBucket bucket;
  final bool canViewContact;
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
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(11)),
                ),
                child: const Text('Refuser', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700)),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: ElevatedButton(
                onPressed: onAccept,
                style: ElevatedButton.styleFrom(
                  backgroundColor: colors.primary,
                  foregroundColor: colors.onPrimary,
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(11)),
                ),
                child: const Text('Accepter', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700)),
              ),
            ),
            if (onCall != null) ...[
              const SizedBox(width: 8),
              _IconButton(icon: Icons.call_outlined, onTap: onCall!),
            ],
          ],
        );
      case ReplacementCandidateBucket.accepted:
        return Row(
          children: [
            if (canViewContact && onCall != null) ...[
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onCall,
                  icon: Icon(Icons.call_outlined, size: 15, color: colors.textPrimary),
                  label: const Text('Appeler', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700)),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: colors.textPrimary,
                    side: BorderSide(color: colors.border),
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(11)),
                  ),
                ),
              ),
              const SizedBox(width: 8),
            ],
            Expanded(
              child: OutlinedButton(
                onPressed: onCancelAcceptance,
                style: OutlinedButton.styleFrom(
                  foregroundColor: colors.dangerFg,
                  side: BorderSide(color: colors.dangerFg.withValues(alpha: 0.4)),
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(11)),
                ),
                child: const Text("Annuler l'acceptation",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        );
      case ReplacementCandidateBucket.closed:
        return Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Candidature close', style: TextStyle(color: colors.textSecondary, fontSize: 11.5)),
            TextButton(
              onPressed: onReexamine,
              style: TextButton.styleFrom(padding: EdgeInsets.zero, minimumSize: const Size(0, 0)),
              child: Text(
                'Réexaminer',
                style: TextStyle(color: colors.textSecondary, fontWeight: FontWeight.w700, fontSize: 12),
              ),
            ),
          ],
        );
    }
  }
}

class _IconButton extends StatelessWidget {
  const _IconButton({required this.icon, required this.onTap});

  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(11),
        child: Container(
          width: 38,
          height: 38,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            border: Border.all(color: colors.border),
            borderRadius: BorderRadius.circular(11),
          ),
          child: Icon(icon, size: 16, color: colors.textPrimary),
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 24),
      child: Column(
        children: [
          Icon(Icons.groups_outlined, size: 38, color: colors.border),
          const SizedBox(height: 12),
          Text(
            'Aucune candidature',
            style: TextStyle(color: colors.textPrimary, fontSize: 13, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 4),
          Text(
            'Les infirmiers intéressés par ce remplacement apparaîtront ici.',
            textAlign: TextAlign.center,
            style: TextStyle(color: colors.textSecondary, fontSize: 11.5, height: 1.5),
          ),
        ],
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.error_outline, size: 34, color: colors.textSecondary),
            const SizedBox(height: 12),
            Text(message, textAlign: TextAlign.center, style: TextStyle(color: colors.textSecondary)),
            const SizedBox(height: 12),
            OutlinedButton(onPressed: onRetry, child: const Text('Réessayer')),
          ],
        ),
      ),
    );
  }
}
