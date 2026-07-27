import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../../replacements/data/replacements_repository.dart';
import '../../replacements/models/replacement_item.dart';
import '../../replacements/presentation/replacement_detail_screen.dart';
import '../data/notifications_list_notifier.dart';
import '../models/notification_item.dart';
import 'widgets/notification_card.dart';

const _ownerNotificationTypes = {'replacement.response', 'replacement.canceled'};

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() =>
      _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (!_scrollController.hasClients) return;
    final threshold = _scrollController.position.maxScrollExtent - 300;
    if (_scrollController.position.pixels >= threshold) {
      ref.read(notificationsListProvider.notifier).loadMore();
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final asyncList = ref.watch(notificationsListProvider);
    final isLoadingMore = ref.watch(notificationsLoadingMoreProvider);
    final notifier = ref.read(notificationsListProvider.notifier);

    final hasUnread = asyncList.maybeWhen(
      data: (items) => items.any((item) => !item.isRead),
      orElse: () => false,
    );

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Notifications',
                          style: TextStyle(
                            color: colors.textPrimary,
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Container(
                          width: 48,
                          height: 3,
                          decoration: BoxDecoration(
                            color: colors.primary,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ],
                    ),
                  ),
                  if (hasUnread)
                    TextButton(
                      onPressed: notifier.markAllAsRead,
                      style: TextButton.styleFrom(padding: EdgeInsets.zero),
                      child: Text(
                        'Tout marquer lu',
                        style: TextStyle(
                          color: colors.primary,
                          fontWeight: FontWeight.w700,
                          fontSize: 12.5,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            Expanded(
              child: asyncList.when(
                loading: () => Center(
                  child: CircularProgressIndicator(color: colors.primary),
                ),
                error: (error, _) => _ErrorState(
                  message: error is ApiException
                      ? error.message
                      : 'Impossible de charger les notifications.',
                  onRetry: notifier.refresh,
                ),
                data: (items) {
                  if (items.isEmpty) {
                    return RefreshIndicator(
                      color: colors.primary,
                      onRefresh: notifier.refresh,
                      child: ListView(
                        padding: const EdgeInsets.symmetric(vertical: 40),
                        children: const [_EmptyState()],
                      ),
                    );
                  }

                  return RefreshIndicator(
                    color: colors.primary,
                    onRefresh: notifier.refresh,
                    child: ListView.separated(
                      controller: _scrollController,
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                      itemCount: items.length + (isLoadingMore ? 1 : 0),
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        if (index >= items.length) {
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            child: Center(
                              child: CircularProgressIndicator(
                                color: colors.primary,
                              ),
                            ),
                          );
                        }
                        final item = items[index];
                        return NotificationCard(
                          item: item,
                          onTap: () {
                            if (!item.isRead) {
                              notifier.markAsRead(item.id);
                            }
                            _openReplacementIfAny(context, ref, item);
                          },
                        );
                      },
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
}

Future<void> _openReplacementIfAny(
  BuildContext context,
  WidgetRef ref,
  NotificationItem item,
) async {
  if (!item.type.startsWith('replacement.')) return;

  final rawId = item.data['replacement_id'];
  final replacementId = rawId is int ? rawId : int.tryParse(rawId?.toString() ?? '');
  if (replacementId == null) return;

  var dialogIsOpen = true;
  showDialog<void>(
    context: context,
    barrierDismissible: false,
    builder: (_) => const PopScope(
      canPop: false,
      child: Center(child: CircularProgressIndicator()),
    ),
  ).then((_) => dialogIsOpen = false);

  ReplacementItem? replacement;
  ApiException? error;
  try {
    replacement = await ref.read(replacementsRepositoryProvider).fetchById(replacementId);
  } on ApiException catch (e) {
    error = e;
  }

  if (dialogIsOpen && context.mounted) {
    Navigator.of(context).pop();
  }
  if (!context.mounted) return;

  if (replacement != null) {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => ReplacementDetailScreen(
          item: replacement!,
          isOwner: _ownerNotificationTypes.contains(item.type),
        ),
      ),
    );
  } else {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(error?.message ?? 'Ce remplacement est introuvable.'),
        backgroundColor: AppColors.coral,
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
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        children: [
          Icon(Icons.notifications_none, size: 38, color: colors.border),
          const SizedBox(height: 12),
          Text(
            'Aucune notification',
            style: TextStyle(
              color: colors.textPrimary,
              fontSize: 13,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Vos notifications apparaîtront ici.',
            textAlign: TextAlign.center,
            style: TextStyle(color: colors.textSecondary, fontSize: 11.5, height: 1.5),
          ),
        ],
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({
    required this.message,
    required this.onRetry,
  });

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.coral),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: onRetry,
              style: ElevatedButton.styleFrom(
                backgroundColor: colors.primary,
                foregroundColor: colors.onPrimary,
              ),
              child: const Text('Réessayer'),
            ),
          ],
        ),
      ),
    );
  }
}
