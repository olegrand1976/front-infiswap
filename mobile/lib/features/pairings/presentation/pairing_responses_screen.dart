import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radii.dart';
import '../data/pairing_responses_notifier.dart';
import '../models/pairing_response.dart';

class PairingResponsesScreen extends ConsumerWidget {
  const PairingResponsesScreen({super.key});

  Future<void> _confirmAndUpdate(
    BuildContext context,
    WidgetRef ref, {
    required PairingResponse response,
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
              child: Text('Annuler',
                  style: TextStyle(color: colors.textSecondary)),
            ),
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(true),
              child: Text(confirmLabel,
                  style: TextStyle(
                      color: confirmColor, fontWeight: FontWeight.w700)),
            ),
          ],
        );
      },
    );

    if (confirmed != true) return;

    try {
      await ref
          .read(pairingResponsesProvider.notifier)
          .updateStatus(response.id, status);
    } on ApiException catch (error) {
      if (context.mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(error.message)));
      }
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;
    final asyncResponses = ref.watch(pairingResponsesProvider);
    final notifier = ref.read(pairingResponsesProvider.notifier);

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
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Réponses reçues',
                        style: TextStyle(
                            color: colors.textPrimary,
                            fontSize: 16,
                            fontWeight: FontWeight.w800),
                      ),
                      Text('Sur vos demandes ouvertes',
                          style: TextStyle(
                              color: colors.textSecondary, fontSize: 12)),
                    ],
                  ),
                ],
              ),
            ),
            Expanded(
              child: asyncResponses.when(
                loading: () => Center(
                    child: CircularProgressIndicator(color: colors.primary)),
                error: (error, _) => _ErrorState(
                  message: error is ApiException
                      ? error.message
                      : 'Impossible de charger les réponses.',
                  onRetry: notifier.refresh,
                ),
                data: (responses) {
                  if (responses.isEmpty) {
                    return RefreshIndicator(
                      color: colors.primary,
                      onRefresh: notifier.refresh,
                      child: ListView(
                        padding: const EdgeInsets.symmetric(vertical: 60),
                        children: const [_EmptyState()],
                      ),
                    );
                  }

                  final groups = _groupByPairing(responses);

                  return RefreshIndicator(
                    color: colors.primary,
                    onRefresh: notifier.refresh,
                    child: ListView(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 20),
                      children: [
                        for (final group in groups) ...[
                          _GroupHeader(group: group),
                          const SizedBox(height: 10),
                          for (final response in group.responses) ...[
                            _ResponseCard(
                              response: response,
                              onAccept: () => _confirmAndUpdate(
                                context,
                                ref,
                                response: response,
                                status: 'accepted',
                                title: 'Accepter cette candidate ?',
                                message:
                                    '${response.respondentName} sera confirmée pour ce binôme. Les autres candidates ne pourront plus être acceptées.',
                                confirmLabel: 'Accepter',
                                confirmColor: colors.successFg,
                              ),
                              onRefuse: () => _confirmAndUpdate(
                                context,
                                ref,
                                response: response,
                                status: 'rejected',
                                title: 'Refuser cette candidate ?',
                                message:
                                    'Cette demande sera fermée et ${response.respondentName} sera notifiée du refus.',
                                confirmLabel: 'Refuser',
                                confirmColor: colors.dangerFg,
                              ),
                            ),
                            const SizedBox(height: 12),
                          ],
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

  static List<_ResponseGroup> _groupByPairing(List<PairingResponse> responses) {
    final byPairing = <int, List<PairingResponse>>{};
    for (final response in responses) {
      (byPairing[response.pairingId] ??= []).add(response);
    }
    return byPairing.entries
        .map((entry) => _ResponseGroup(
              pairingId: entry.key,
              description: entry.value.first.pairingDescription,
              responses: entry.value,
            ))
        .toList();
  }
}

class _ResponseGroup {
  const _ResponseGroup(
      {required this.pairingId,
      required this.description,
      required this.responses});

  final int pairingId;
  final String? description;
  final List<PairingResponse> responses;
}

class _GroupHeader extends StatelessWidget {
  const _GroupHeader({required this.group});

  final _ResponseGroup group;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
          color: colors.card,
          borderRadius: BorderRadius.circular(AppRadii.md),
          border: Border.all(color: colors.border)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Demande #${group.pairingId}',
              style: TextStyle(
                  color: colors.textPrimary,
                  fontSize: 13,
                  fontWeight: FontWeight.w700)),
          if (group.description != null && group.description!.isNotEmpty) ...[
            const SizedBox(height: 3),
            Text(group.description!,
                style: TextStyle(
                    color: colors.textSecondary, fontSize: 11.5, height: 1.4)),
          ],
        ],
      ),
    );
  }
}

class _ResponseCard extends StatelessWidget {
  const _ResponseCard(
      {required this.response, required this.onAccept, required this.onRefuse});

  final PairingResponse response;
  final VoidCallback onAccept;
  final VoidCallback onRefuse;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final bucket = pairingResponseBucket(response.status);
    final isAccepted = bucket == PairingResponseBucket.accepted;
    final (statusBg, statusFg) = switch (bucket) {
      PairingResponseBucket.accepted => (colors.successBg, colors.successFg),
      PairingResponseBucket.closed => (colors.dangerBg, colors.dangerFg),
      PairingResponseBucket.pending => (colors.pendingBg, colors.pendingFg),
    };

    return Opacity(
      opacity: bucket == PairingResponseBucket.closed ? 0.6 : 1,
      child: Container(
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
              color: isAccepted ? colors.successFg : colors.border,
              width: isAccepted ? 1.6 : 1),
          boxShadow: [
            BoxShadow(
                color: colors.shadow,
                blurRadius: isAccepted ? 16 : 10,
                offset: const Offset(0, 3))
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (isAccepted)
              Container(
                width: double.infinity,
                padding:
                    const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                color: colors.successBg,
                child: Row(
                  children: [
                    Icon(Icons.check_circle, size: 14, color: colors.successFg),
                    const SizedBox(width: 6),
                    Text('Binôme retenu pour cette demande',
                        style: TextStyle(
                            color: colors.successFg,
                            fontSize: 11,
                            fontWeight: FontWeight.w800)),
                  ],
                ),
              ),
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 12, 14, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _Avatar(
                          name: response.respondentName,
                          initials: response.initials),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(response.respondentName,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                    color: colors.textPrimary,
                                    fontSize: 13.5,
                                    fontWeight: FontWeight.w700)),
                            const SizedBox(height: 3),
                            Text(response.respondentCity ?? '—',
                                style: TextStyle(
                                    color: colors.textSecondary, fontSize: 11)),
                          ],
                        ),
                      ),
                      if (!isAccepted)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 9, vertical: 4),
                          decoration: BoxDecoration(
                              color: statusBg,
                              borderRadius: BorderRadius.circular(999)),
                          child: Text(
                              pairingResponseStatusLabel(response.status),
                              style: TextStyle(
                                  color: statusFg,
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.w800)),
                        ),
                    ],
                  ),
                  if (response.comment != null &&
                      response.comment!.isNotEmpty) ...[
                    const SizedBox(height: 10),
                    Text(response.comment!,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                            color: colors.textSecondary,
                            fontSize: 12,
                            height: 1.4)),
                  ],
                  const SizedBox(height: 11),
                  Divider(color: colors.divider, height: 1),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 10, 14, 12),
              child: switch (bucket) {
                PairingResponseBucket.pending => Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: onRefuse,
                          style: OutlinedButton.styleFrom(
                              foregroundColor: colors.dangerFg,
                              side: BorderSide(
                                  color:
                                      colors.dangerFg.withValues(alpha: 0.4))),
                          child: const Text('Refuser',
                              style: TextStyle(
                                  fontSize: 12.5, fontWeight: FontWeight.w700)),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: onAccept,
                          style: ElevatedButton.styleFrom(
                              backgroundColor: colors.primary,
                              foregroundColor: colors.onPrimary),
                          child: const Text('Accepter',
                              style: TextStyle(
                                  fontSize: 12.5, fontWeight: FontWeight.w700)),
                        ),
                      ),
                    ],
                  ),
                PairingResponseBucket.accepted => Text('Binôme confirmé',
                    style:
                        TextStyle(color: colors.textSecondary, fontSize: 11.5)),
                PairingResponseBucket.closed => Text('Candidature close',
                    style:
                        TextStyle(color: colors.textSecondary, fontSize: 11.5)),
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _Avatar extends StatelessWidget {
  const _Avatar({required this.name, required this.initials});

  final String name;
  final String initials;

  @override
  Widget build(BuildContext context) {
    const palette = AppColors.avatarPalette;
    final (bg, fg) = palette[name.hashCode.abs() % palette.length];

    return Container(
      width: 42,
      height: 42,
      alignment: Alignment.center,
      decoration: BoxDecoration(
          color: bg, borderRadius: BorderRadius.circular(AppRadii.md)),
      child: Text(initials,
          style:
              TextStyle(color: fg, fontSize: 14, fontWeight: FontWeight.w800)),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          Icon(Icons.groups_outlined, size: 38, color: colors.border),
          const SizedBox(height: 12),
          Text('Aucune réponse',
              style: TextStyle(
                  color: colors.textPrimary,
                  fontSize: 13,
                  fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text(
            'Les infirmières intéressées par vos demandes apparaîtront ici.',
            textAlign: TextAlign.center,
            style: TextStyle(
                color: colors.textSecondary, fontSize: 11.5, height: 1.5),
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
            Text(message,
                textAlign: TextAlign.center,
                style: TextStyle(color: colors.textSecondary)),
            const SizedBox(height: 12),
            OutlinedButton(onPressed: onRetry, child: const Text('Réessayer')),
          ],
        ),
      ),
    );
  }
}
