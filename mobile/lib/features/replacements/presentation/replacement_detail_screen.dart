import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../../applications/data/applications_list_notifier.dart';
import '../../applications/data/applications_repository.dart';
import '../../auth/providers/auth_session_provider.dart';
import '../data/my_replacements_list_notifier.dart';
import '../data/replacement_create_repository.dart';
import '../models/replacement_item.dart';
import 'edit_replacement_screen.dart';
import 'replacement_candidates_screen.dart';
import 'widgets/mission_avatar.dart';
import 'widgets/platform_access_sheet.dart';
import 'widgets/replacement_boost_sheet.dart';

enum _ApplyStatus { idle, loading, applied }

class ReplacementDetailScreen extends ConsumerStatefulWidget {
  const ReplacementDetailScreen({
    super.key,
    required this.item,
    this.isOwner = false,
  });

  final ReplacementItem item;

  final bool isOwner;

  @override
  ConsumerState<ReplacementDetailScreen> createState() =>
      _ReplacementDetailScreenState();
}

class _ReplacementDetailScreenState
    extends ConsumerState<ReplacementDetailScreen> {
  _ApplyStatus _status = _ApplyStatus.idle;

  ReplacementItem get item => widget.item;

  int? get _userId {
    final id = ref.read(authSessionProvider)?.user['id'];
    if (id is int) {
      return id;
    }
    if (id is String) {
      return int.tryParse(id);
    }
    return null;
  }

  Future<void> _apply() async {
    if (_status != _ApplyStatus.idle) {
      return;
    }

    final userId = _userId;
    if (userId == null) {
      return;
    }

    setState(() => _status = _ApplyStatus.loading);

    final repository = ref.read(applicationsRepositoryProvider);

    try {
      if (item.isMission) {
        final missionId = int.tryParse(item.id.replaceFirst('mission-', ''));
        if (missionId == null) {
          throw StateError('Identifiant de mission invalide.');
        }
        await repository.applyToMission(missionId: missionId, userId: userId);
      } else {
        final replacementId = int.tryParse(item.id);
        if (replacementId == null) {
          throw StateError('Identifiant de remplacement invalide.');
        }
        await repository.applyToReplacement(
          replacementId: replacementId,
          userId: userId,
        );
      }
      if (!mounted) return;
      setState(() => _status = _ApplyStatus.applied);
      ref.read(applicationsListProvider.notifier).refresh();
    } on ApiException catch (error) {
      if (!mounted) return;
      if (error.isPlatformAccessRequired) {
        setState(() => _status = _ApplyStatus.idle);
        await PlatformAccessSheet.show(context);
        return;
      }
      var message = error.message;
      if (error.errors != null && error.errors!.isNotEmpty) {
        message = error.errors!.values.first.first;
      }
      if (message.toLowerCase().contains('déjà')) {
        setState(() => _status = _ApplyStatus.applied);
        return;
      }
      setState(() => _status = _ApplyStatus.idle);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(message)));
    } catch (_) {
      if (!mounted) return;
      setState(() => _status = _ApplyStatus.idle);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Une erreur est survenue.')),
      );
    }
  }

  _ApplyStatus _effectiveStatus(WidgetRef ref) {
    if (_status != _ApplyStatus.idle) {
      return _status;
    }
    if (item.isMission) {
      return _ApplyStatus.idle;
    }
    final alreadyApplied = ref.watch(applicationsListProvider).maybeWhen(
          data: (list) =>
              list.any((application) => application.replacement.id == item.id),
          orElse: () => false,
        );
    return alreadyApplied ? _ApplyStatus.applied : _ApplyStatus.idle;
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final effectiveStatus = _effectiveStatus(ref);

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
                        fontSize: 16,
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
            if (widget.isOwner)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                child: _OwnerFooter(item: item),
              )
            else
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed:
                        effectiveStatus == _ApplyStatus.idle ? _apply : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colors.primary,
                      foregroundColor: colors.onPrimary,
                      disabledBackgroundColor:
                          effectiveStatus == _ApplyStatus.applied
                              ? AppColors.mint
                              : colors.primary,
                      disabledForegroundColor: AppColors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: _ApplyButtonLabel(status: effectiveStatus),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _OwnerFooter extends ConsumerWidget {
  const _OwnerFooter({required this.item});

  final ReplacementItem item;

  Future<void> _delete(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) {
        final dialogColors = dialogContext.appColors;
        return AlertDialog(
          backgroundColor: dialogColors.card,
          title: Text("Supprimer l'annonce ?",
              style: TextStyle(color: dialogColors.textPrimary)),
          content: Text(
            'Cette action est définitive. Les candidatures reçues seront également supprimées.',
            style: TextStyle(color: dialogColors.textSecondary),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(false),
              child: Text('Annuler',
                  style: TextStyle(color: dialogColors.textSecondary)),
            ),
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(true),
              child: const Text('Supprimer',
                  style: TextStyle(
                      color: AppColors.coral, fontWeight: FontWeight.w700)),
            ),
          ],
        );
      },
    );

    if (confirmed != true || !context.mounted) {
      return;
    }

    try {
      final replacementId = int.parse(item.id);
      await ref
          .read(replacementCreateRepositoryProvider)
          .deleteReplacement(replacementId);
      if (!context.mounted) return;
      ref.read(myReplacementsListProvider.notifier).refresh();
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Annonce supprimée')),
      );
    } on ApiException catch (error) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text(error.message), backgroundColor: AppColors.coral),
      );
    } catch (_) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Une erreur est survenue.')),
      );
    }
  }

  Future<void> _release(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) {
        final dialogColors = dialogContext.appColors;
        return AlertDialog(
          backgroundColor: dialogColors.card,
          title: Text('Libérer ce remplacement ?',
              style: TextStyle(color: dialogColors.textPrimary)),
          content: Text(
            'Le remplaçant confirmé sera désengagé et l\'annonce redeviendra ouverte aux candidatures.',
            style: TextStyle(color: dialogColors.textSecondary),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(false),
              child: Text('Annuler',
                  style: TextStyle(color: dialogColors.textSecondary)),
            ),
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(true),
              child: Text('Libérer',
                  style: TextStyle(
                      color: dialogColors.primary,
                      fontWeight: FontWeight.w700)),
            ),
          ],
        );
      },
    );

    if (confirmed != true || !context.mounted) {
      return;
    }

    try {
      final replacementId = int.parse(item.id);
      await ref
          .read(replacementCreateRepositoryProvider)
          .release(replacementId);
      if (!context.mounted) return;
      ref.read(myReplacementsListProvider.notifier).refresh();
      Navigator.of(context).pop();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Remplacement libéré')),
      );
    } on ApiException catch (error) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text(error.message), backgroundColor: AppColors.coral),
      );
    } catch (_) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Une erreur est survenue.')),
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;
    final status = myReplacementStatus(item);
    final (background, foreground) = switch (status) {
      MyReplacementStatus.filled => (colors.successBg, colors.successFg),
      MyReplacementStatus.closed => (colors.dangerBg, colors.dangerFg),
      MyReplacementStatus.open => (colors.pendingBg, colors.pendingFg),
    };

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: () => Navigator.of(context).push(
              MaterialPageRoute<void>(
                builder: (_) => ReplacementCandidatesScreen(item: item),
              ),
            ),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
              decoration: BoxDecoration(
                color: background,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.groups_outlined, size: 18, color: foreground),
                  const SizedBox(width: 8),
                  Text(
                    '${myReplacementStatusLabel(status)} · ${item.responseCount} candidature${item.responseCount > 1 ? 's' : ''}',
                    style: TextStyle(
                        color: foreground,
                        fontSize: 14,
                        fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(width: 6),
                  Icon(Icons.chevron_right, size: 18, color: foreground),
                ],
              ),
            ),
          ),
        ),
        if (status == MyReplacementStatus.open && !item.isMission) ...[
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () async {
                final updated = await Navigator.of(context).push<bool>(
                  MaterialPageRoute<bool>(
                    builder: (_) => EditReplacementScreen(item: item),
                  ),
                );
                if (updated == true && context.mounted) {
                  Navigator.of(context).pop();
                }
              },
              icon: Icon(Icons.edit_outlined, color: colors.primary, size: 18),
              label: Text(
                "Modifier l'annonce",
                style: TextStyle(
                    color: colors.primary, fontWeight: FontWeight.w700),
              ),
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: colors.primaryOutline),
                padding: const EdgeInsets.symmetric(vertical: 13),
              ),
            ),
          ),
        ],
        if (status == MyReplacementStatus.closed && !item.isMission) ...[
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () async {
                final updated = await Navigator.of(context).push<bool>(
                  MaterialPageRoute<bool>(
                    builder: (_) =>
                        EditReplacementScreen(item: item, isRepost: true),
                  ),
                );
                if (updated == true && context.mounted) {
                  Navigator.of(context).pop();
                }
              },
              icon: Icon(Icons.campaign_outlined,
                  color: colors.primary, size: 18),
              label: Text(
                "Republier l'annonce",
                style: TextStyle(
                    color: colors.primary, fontWeight: FontWeight.w700),
              ),
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: colors.primaryOutline),
                padding: const EdgeInsets.symmetric(vertical: 13),
              ),
            ),
          ),
        ],
        if (status == MyReplacementStatus.filled && !item.isMission) ...[
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () => _release(context, ref),
              icon: Icon(Icons.lock_open_outlined,
                  color: colors.primary, size: 18),
              label: Text(
                'Libérer le remplacement',
                style: TextStyle(
                    color: colors.primary, fontWeight: FontWeight.w700),
              ),
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: colors.primaryOutline),
                padding: const EdgeInsets.symmetric(vertical: 13),
              ),
            ),
          ),
        ],
        if (status == MyReplacementStatus.open) ...[
          const SizedBox(height: 10),
          if (item.isBoosted)
            _BoostStatusRow(item: item)
          else
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () => ReplacementBoostSheet.show(context, item),
                icon: Icon(Icons.trending_up, color: colors.primary, size: 18),
                label: Text(
                  'Mettre en avant',
                  style: TextStyle(
                      color: colors.primary, fontWeight: FontWeight.w700),
                ),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: colors.primaryOutline),
                  padding: const EdgeInsets.symmetric(vertical: 13),
                ),
              ),
            ),
        ],
        if (!item.isMission) ...[
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: TextButton.icon(
              onPressed: () => _delete(context, ref),
              icon: const Icon(Icons.delete_outline,
                  color: AppColors.coral, size: 18),
              label: const Text(
                "Supprimer l'annonce",
                style: TextStyle(
                    color: AppColors.coral, fontWeight: FontWeight.w700),
              ),
            ),
          ),
        ],
      ],
    );
  }
}

class _BoostStatusRow extends StatelessWidget {
  const _BoostStatusRow({required this.item});

  final ReplacementItem item;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final until = item.boostedUntil;

    return Row(
      children: [
        const Icon(Icons.bolt, size: 16, color: AppColors.boostGold),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            until != null
                ? 'Mise en avant active jusqu\'au ${_formatDate(until)}'
                : 'Mise en avant active',
            style: TextStyle(
                color: colors.textSecondary,
                fontSize: 12.5,
                fontWeight: FontWeight.w500),
          ),
        ),
        TextButton(
          onPressed: () => ReplacementBoostSheet.show(context, item),
          style: TextButton.styleFrom(
              padding: EdgeInsets.zero, minimumSize: const Size(0, 0)),
          child: Text(
            'Prolonger',
            style: TextStyle(
                color: colors.primary,
                fontWeight: FontWeight.w700,
                fontSize: 12.5),
          ),
        ),
      ],
    );
  }

  static String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }
}

class _ApplyButtonLabel extends StatelessWidget {
  const _ApplyButtonLabel({required this.status});

  final _ApplyStatus status;

  @override
  Widget build(BuildContext context) {
    switch (status) {
      case _ApplyStatus.idle:
        return const Text(
          'Je suis intéressé(e)',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
        );
      case _ApplyStatus.loading:
        return const SizedBox(
          width: 22,
          height: 22,
          child: CircularProgressIndicator(
            strokeWidth: 2.4,
            valueColor: AlwaysStoppedAnimation(AppColors.white),
          ),
        );
      case _ApplyStatus.applied:
        return const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.check_circle, size: 20, color: AppColors.white),
            SizedBox(width: 8),
            Text(
              'Candidature envoyée',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
          ],
        );
    }
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
        border: Border.all(color: colors.border),
        boxShadow: [
          BoxShadow(
            color: colors.shadow,
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
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
                color: colors.divider,
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
            border: Border.all(color: colors.border),
            boxShadow: [
              BoxShadow(
                color: colors.shadow,
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
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
        border: Border.all(color: colors.border),
        boxShadow: [
          BoxShadow(
            color: colors.shadow,
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
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
                  color: colors.primaryMuted,
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
          Divider(color: colors.divider, height: 1),
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
        color: emphasized ? colors.primaryMuted : colors.background,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: emphasized ? colors.primaryOutline : colors.border,
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
    final colors = context.appColors;

    return _InfoCard(
      icon: Icons.calendar_today_outlined,
      label: 'PÉRIODES',
      child: Column(
        children: [
          for (var i = 0; i < periods.length; i++) ...[
            if (i > 0) Divider(color: colors.divider, height: 20),
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
        border: Border.all(color: colors.primaryOutline),
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
        border: Border.all(color: colors.border),
        boxShadow: [
          BoxShadow(
            color: colors.shadow,
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: colors.primaryMuted,
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
        border: Border.all(color: colors.primaryOutline),
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
        Icon(Icons.star, size: 18, color: AppColors.boostGold),
        Icon(Icons.star, size: 18, color: AppColors.boostGold),
        Icon(Icons.star, size: 18, color: AppColors.boostGold),
        Icon(Icons.star, size: 18, color: AppColors.boostGold),
        Icon(Icons.star, size: 18, color: AppColors.boostGold),
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
          Icon(Icons.campaign_outlined, size: 12, color: AppColors.onCoral),
          SizedBox(width: 4),
          Text(
            'Urgent',
            style: TextStyle(
              color: AppColors.onCoral,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
