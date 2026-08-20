import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../../notifications/models/notification_item.dart';
import '../data/replacements_repository.dart';
import '../models/replacement_item.dart';
import 'replacement_detail_screen.dart';

class ReplacementDeepLinkScreen extends ConsumerStatefulWidget {
  const ReplacementDeepLinkScreen({
    super.key,
    required this.id,
    this.isMission = false,
    this.notificationType,
  });

  final int id;
  final bool isMission;
  final String? notificationType;

  @override
  ConsumerState<ReplacementDeepLinkScreen> createState() =>
      _ReplacementDeepLinkScreenState();
}

class _ReplacementDeepLinkScreenState
    extends ConsumerState<ReplacementDeepLinkScreen> {
  late final Future<ReplacementItem> _future;

  @override
  void initState() {
    super.initState();
    final repository = ref.read(replacementsRepositoryProvider);
    _future = widget.isMission
        ? repository.fetchMissionById(widget.id)
        : repository.fetchById(widget.id);
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return FutureBuilder<ReplacementItem>(
      future: _future,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return Scaffold(
            backgroundColor: colors.background,
            body:
                Center(child: CircularProgressIndicator(color: colors.primary)),
          );
        }

        final item = snapshot.data;
        if (item == null) {
          final error = snapshot.error;
          final message = error is ApiException
              ? error.message
              : widget.isMission
                  ? 'Cette mission est introuvable.'
                  : 'Ce remplacement est introuvable.';
          return _DeepLinkError(message: message);
        }

        return ReplacementDetailScreen(
          item: item,
          isOwner: widget.notificationType != null &&
              isOwnerNotificationType(widget.notificationType!),
        );
      },
    );
  }
}

class _DeepLinkError extends StatelessWidget {
  const _DeepLinkError({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.error_outline,
                    size: 34, color: colors.textSecondary),
                const SizedBox(height: 12),
                Text(
                  message,
                  textAlign: TextAlign.center,
                  style: TextStyle(color: colors.textSecondary),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => context.go('/home'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colors.primary,
                    foregroundColor: colors.onPrimary,
                  ),
                  child: const Text('Retour à l’accueil'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
