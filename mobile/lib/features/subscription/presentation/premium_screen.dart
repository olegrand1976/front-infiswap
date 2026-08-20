import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show PlatformException;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_web_auth_2/flutter_web_auth_2.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radii.dart';
import '../../../core/utils/date_time_format.dart';
import '../../../core/widgets/skeleton_box.dart';
import '../data/subscription_repository.dart';
import '../models/pro_plan.dart';
import '../models/pro_subscription_status.dart';

const _proCallbackScheme = 'infiswapmobile';

class PremiumScreen extends ConsumerStatefulWidget {
  const PremiumScreen({super.key});

  @override
  ConsumerState<PremiumScreen> createState() => _PremiumScreenState();
}

class _PremiumScreenState extends ConsumerState<PremiumScreen> {
  bool _busy = false;
  String? _pendingWebCheckoutUrl;

  void _showSnack(String message, {bool isError = true}) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
          content: Text(message),
          backgroundColor: isError ? AppColors.coral : null),
    );
  }

  Future<void> _subscribe(ProPlan plan) async {
    if (_busy) return;
    setState(() => _busy = true);

    if (_pendingWebCheckoutUrl != null) {
      await _openCheckout(_pendingWebCheckoutUrl!);
      return;
    }

    final repository = ref.read(subscriptionRepositoryProvider);
    try {
      final checkoutUrl = await repository.createProCheckout(
        lookupKey: plan.lookupKey,
        platform: 'mobile',
        returnOrigin: kIsWeb ? Uri.base.origin : null,
      );

      if (kIsWeb) {
        if (!mounted) return;
        setState(() {
          _pendingWebCheckoutUrl = checkoutUrl;
          _busy = false;
        });
        return;
      }

      await _openCheckout(checkoutUrl);
    } on ApiException catch (error) {
      _showSnack(error.message);
      if (mounted) setState(() => _busy = false);
    } catch (_) {
      _showSnack('Une erreur est survenue.');
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _openCheckout(String checkoutUrl) async {
    final repository = ref.read(subscriptionRepositoryProvider);
    try {
      final callback = await FlutterWebAuth2.authenticate(
        url: checkoutUrl,
        callbackUrlScheme: kIsWeb ? 'https' : _proCallbackScheme,
      );

      final params = Uri.parse(callback).queryParameters;
      final sessionId = params['session_id'];

      if (params['status'] == 'success' && sessionId != null) {
        final active =
            await repository.confirmProCheckout(sessionId: sessionId);
        await ref.read(proStatusProvider.notifier).refresh();
        _showSnack(
          active
              ? 'Bienvenue dans Infiswap Premium.'
              : 'Paiement reçu, activation en cours — réessayez dans quelques instants.',
          isError: false,
        );
      }
      if (mounted) setState(() => _pendingWebCheckoutUrl = null);
    } on ApiException catch (error) {
      _showSnack(error.message);
    } on PlatformException catch (error) {
      if (error.code != 'CANCELED') {
        _showSnack(error.message ?? 'Le paiement a échoué.');
      }
    } catch (_) {
      _showSnack('Une erreur est survenue.');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _manage() async {
    if (_busy) return;
    setState(() => _busy = true);
    final repository = ref.read(subscriptionRepositoryProvider);
    try {
      final url = await repository.openProBillingPortal(
        returnUrl: kIsWeb ? null : '$_proCallbackScheme://pro-portal',
      );
      await FlutterWebAuth2.authenticate(
        url: url,
        callbackUrlScheme: kIsWeb ? 'https' : _proCallbackScheme,
      );
      await ref.read(proStatusProvider.notifier).refresh();
    } on PlatformException catch (error) {
      if (error.code != 'CANCELED') {
        _showSnack(
            error.message ?? "Impossible d'ouvrir le portail de facturation.");
      }
    } on ApiException catch (error) {
      _showSnack(error.message);
    } catch (_) {
      _showSnack('Une erreur est survenue.');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _cancel() async {
    final confirmed = await _confirmDialog(
      title: 'Résilier Infiswap Premium ?',
      message:
          "Vous garderez vos avantages jusqu'à la fin de la période en cours.",
      confirmLabel: 'Résilier',
      confirmColor: AppColors.coral,
    );
    if (confirmed != true || !mounted) return;

    setState(() => _busy = true);
    try {
      await ref.read(subscriptionRepositoryProvider).cancelProSubscription();
      await ref.read(proStatusProvider.notifier).refresh();
    } on ApiException catch (error) {
      _showSnack(error.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _resume() async {
    setState(() => _busy = true);
    try {
      await ref.read(subscriptionRepositoryProvider).resumeProSubscription();
      await ref.read(proStatusProvider.notifier).refresh();
      _showSnack('Abonnement réactivé.', isError: false);
    } on ApiException catch (error) {
      _showSnack(error.message);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<bool?> _confirmDialog({
    required String title,
    required String message,
    required String confirmLabel,
    required Color confirmColor,
  }) {
    return showDialog<bool>(
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
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final asyncStatus = ref.watch(proStatusProvider);
    final canPop = Navigator.of(context).canPop();

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, 20, 8),
              child: Row(
                children: [
                  if (canPop)
                    IconButton(
                      onPressed: () => Navigator.of(context).pop(),
                      icon: Icon(Icons.arrow_back, color: colors.primary),
                    )
                  else
                    const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Infiswap Premium',
                          style: TextStyle(
                            color: colors.textPrimary,
                            fontSize: 16,
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
                ],
              ),
            ),
            Expanded(
              child: asyncStatus.when(
                loading: () => const _PremiumSkeleton(),
                error: (error, _) => _ErrorState(
                  message: error is ApiException
                      ? error.message
                      : 'Impossible de charger votre abonnement.',
                  onRetry: () => ref.read(proStatusProvider.notifier).refresh(),
                ),
                data: (status) => status.isPremium
                    ? _ActiveBody(
                        status: status,
                        busy: _busy,
                        onManage: _manage,
                        onCancel: _cancel,
                        onResume: _resume,
                      )
                    : _UpsellBody(
                        busy: _busy,
                        awaitingWebPayment: _pendingWebCheckoutUrl != null,
                        onSubscribe: _subscribe,
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActiveBody extends StatelessWidget {
  const _ActiveBody({
    required this.status,
    required this.busy,
    required this.onManage,
    required this.onCancel,
    required this.onResume,
  });

  final ProSubscriptionStatus status;
  final bool busy;
  final VoidCallback onManage;
  final VoidCallback onCancel;
  final VoidCallback onResume;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final subscription = status.subscription;
    final plan = subscription?.plan;
    final onGracePeriod = subscription?.onGracePeriod ?? false;
    final endsAt = subscription?.endsAt;
    final boostCredit = status.boostCredit;

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
      children: [
        const _SectionCaption('Abonnement'),
        _HeroPriceCard(
          amount: plan?.formattedAmount ?? '—',
          cycle: plan?.cycleLabel ?? 'mois',
          boostText: boostCredit.available
              ? 'Crédit boost disponible ce mois-ci'
              : boostCredit.nextCreditAt != null
                  ? 'Boost utilisé — prochain crédit le ${formatDateDmy(boostCredit.nextCreditAt!)}'
                  : 'Crédit boost déjà utilisé ce mois-ci',
        ),
        if (onGracePeriod && endsAt != null)
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: Center(
              child: Text(
                "Résilié — actif jusqu'au ${formatDateDmy(endsAt)}",
                style: TextStyle(
                    color: colors.dangerFg,
                    fontSize: 11.5,
                    fontWeight: FontWeight.w600),
              ),
            ),
          )
        else if (endsAt != null)
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: Center(
              child: Text(
                'Renouvellement le ${formatDateDmy(endsAt)}',
                style: TextStyle(color: colors.textSecondary, fontSize: 11.5),
              ),
            ),
          ),
        const SizedBox(height: 24),
        const _SectionCaption('Ce qui est inclus'),
        _MetaCard(
          rows: [
            const _MetaRow(
                icon: Icons.bolt_outlined,
                iconColor: AppColors.urgent,
                text: 'Alerte instantanée'),
            const _MetaRow(
                icon: Icons.auto_awesome,
                iconColor: AppColors.boostGold,
                text: 'Boost 7 jours offert chaque mois'),
            _MetaRow(
                icon: Icons.description_outlined,
                iconColor: colors.textSecondary,
                text: 'Contrats illimités'),
            const _MetaRow(
                icon: Icons.star,
                iconColor: AppColors.boostGold,
                text: 'Profil mis en valeur'),
          ],
        ),
        const SizedBox(height: 20),
        Center(
          child: SizedBox(
            width: _ctaWidth(context),
            child: ElevatedButton(
              onPressed: busy ? null : onManage,
              style: ElevatedButton.styleFrom(
                backgroundColor: colors.primary,
                foregroundColor: colors.onPrimary,
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
              child: busy
                  ? SizedBox(
                      height: 18,
                      width: 18,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: colors.onPrimary),
                    )
                  : const Text('Gérer mon abonnement'),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Center(
          child: onGracePeriod
              ? SizedBox(
                  width: _ctaWidth(context),
                  child: OutlinedButton(
                    onPressed: busy ? null : onResume,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: colors.textPrimary,
                      side: BorderSide(color: colors.border),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: const Text('Réactiver'),
                  ),
                )
              : TextButton(
                  onPressed: busy ? null : onCancel,
                  child: Text('Résilier',
                      style: TextStyle(
                          color: colors.textSecondary,
                          fontWeight: FontWeight.w600)),
                ),
        ),
      ],
    );
  }
}

/// 50% of screen width on phones, 25% on tablets (≥600dp) — a full-width
/// button doesn't need to stay full-width once the screen is wide.
double _ctaWidth(BuildContext context) {
  final screenWidth = MediaQuery.sizeOf(context).width;
  final isTablet = screenWidth >= 600;
  return screenWidth * (isTablet ? 0.25 : 0.5);
}

class _UpsellBody extends ConsumerWidget {
  const _UpsellBody({
    required this.busy,
    required this.awaitingWebPayment,
    required this.onSubscribe,
  });

  final bool busy;
  final bool awaitingWebPayment;
  final ValueChanged<ProPlan> onSubscribe;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;
    final asyncCatalog = ref.watch(proCatalogProvider);

    return asyncCatalog.when(
      loading: () => const _PremiumSkeleton(),
      error: (error, _) => _ErrorState(
        message: error is ApiException
            ? error.message
            : 'Formules indisponibles pour le moment.',
        onRetry: () => ref.invalidate(proCatalogProvider),
      ),
      data: (plans) {
        if (plans.isEmpty) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Text(
                'Les formules Premium sont temporairement indisponibles.',
                textAlign: TextAlign.center,
                style: TextStyle(color: colors.textSecondary),
              ),
            ),
          );
        }
        final plan = plans.first;

        return ListView(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
          children: [
            const _SectionCaption('Abonnement'),
            _HeroPriceCard(
              amount: plan.formattedAmount,
              cycle: plan.cycleLabel,
              caption: 'Sans engagement',
              boostText: '1 boost de 7 jours offert chaque mois',
            ),
            const SizedBox(height: 24),
            const _SectionCaption('Ce qui est inclus'),
            _MetaCard(
              rows: [
                const _MetaRow(
                  icon: Icons.bolt_outlined,
                  iconColor: AppColors.urgent,
                  text: 'Alerte instantanée',
                  sub: 'vs récap du soir en gratuit',
                ),
                const _MetaRow(
                  icon: Icons.auto_awesome,
                  iconColor: AppColors.boostGold,
                  text: 'Boost 7j offert / mois',
                  sub: 'vs 2–4,40 € à l\'unité',
                ),
                _MetaRow(
                  icon: Icons.description_outlined,
                  iconColor: colors.textSecondary,
                  text: 'Contrats illimités',
                  sub: 'vs 3 € par contrat',
                ),
                const _MetaRow(
                  icon: Icons.star,
                  iconColor: AppColors.boostGold,
                  text: 'Profil mis en valeur',
                  sub: 'vs profil standard',
                ),
              ],
            ),
            const SizedBox(height: 20),
            Center(
              child: SizedBox(
                width: _ctaWidth(context),
                child: ElevatedButton(
                  onPressed: busy ? null : () => onSubscribe(plan),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colors.primary,
                    foregroundColor: colors.onPrimary,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: busy
                      ? SizedBox(
                          height: 18,
                          width: 18,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: colors.onPrimary),
                        )
                      : Text(awaitingWebPayment
                          ? 'Payer maintenant'
                          : "S'abonner"),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}

/// Icon + label row — icons carry color only where the app already gives
/// that concept one (boost → boostGold, urgency → urgent); purely
/// informational rows (cycle, date) stay neutral textSecondary.
class _MetaRow extends StatelessWidget {
  const _MetaRow({
    required this.icon,
    required this.iconColor,
    required this.text,
    this.sub,
  });

  final IconData icon;
  final Color iconColor;
  final String text;
  final String? sub;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 7),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(icon, size: 16, color: iconColor),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(text,
                    style: TextStyle(
                        color: colors.textPrimary,
                        fontSize: 13,
                        fontWeight: FontWeight.w500)),
                if (sub != null) ...[
                  const SizedBox(height: 2),
                  Text(sub!,
                      style:
                          TextStyle(color: colors.textSecondary, fontSize: 11)),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _HeroPriceCard extends StatelessWidget {
  const _HeroPriceCard({
    required this.amount,
    required this.cycle,
    required this.boostText,
    this.caption,
  });

  final String amount;
  final String cycle;
  final String boostText;
  final String? caption;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(AppRadii.md),
        border: Border.all(color: colors.border),
        boxShadow: [
          BoxShadow(
              color: colors.shadow, blurRadius: 10, offset: const Offset(0, 3))
        ],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                amount,
                style: TextStyle(
                  color: colors.primary,
                  fontSize: 30,
                  fontWeight: FontWeight.w800,
                  fontFeatures: const [FontFeature.tabularFigures()],
                ),
              ),
              const SizedBox(width: 4),
              Text(
                '/ $cycle',
                style: TextStyle(
                    color: colors.textSecondary,
                    fontSize: 12.5,
                    fontWeight: FontWeight.w600),
              ),
            ],
          ),
          if (caption != null) ...[
            const SizedBox(height: 3),
            Text(caption!,
                style: TextStyle(color: colors.textSecondary, fontSize: 11)),
          ],
          const SizedBox(height: 12),
          Container(width: 36, height: 1, color: colors.divider),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.auto_awesome,
                  size: 14, color: AppColors.boostGold),
              const SizedBox(width: 6),
              Flexible(
                child: Text(
                  boostText,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: colors.textSecondary,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
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

class _MetaCard extends StatelessWidget {
  const _MetaCard({required this.rows});

  final List<Widget> rows;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 4),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(AppRadii.md),
        border: Border.all(color: colors.border),
        boxShadow: [
          BoxShadow(
              color: colors.shadow, blurRadius: 10, offset: const Offset(0, 3))
        ],
      ),
      child: Column(mainAxisSize: MainAxisSize.min, children: rows),
    );
  }
}

class _SectionCaption extends StatelessWidget {
  const _SectionCaption(this.label);

  final String label;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 7),
      child: Text(
        label.toUpperCase(),
        style: TextStyle(
          color: colors.textSecondary,
          fontSize: 10.5,
          fontWeight: FontWeight.w700,
          letterSpacing: .5,
        ),
      ),
    );
  }
}

// Shown while the status/catalog request is in flight — same card shape
// as the real content so nothing shifts once data arrives.
class _PremiumSkeleton extends StatelessWidget {
  const _PremiumSkeleton();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
      children: const [
        _SectionCaption('Abonnement'),
        _SkeletonCard(rows: 3),
        SizedBox(height: 24),
        _SectionCaption('Ce qui est inclus'),
        _SkeletonCard(rows: 4),
      ],
    );
  }
}

class _SkeletonCard extends StatelessWidget {
  const _SkeletonCard({required this.rows});

  final int rows;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 4),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(AppRadii.md),
        border: Border.all(color: colors.border),
        boxShadow: [
          BoxShadow(
              color: colors.shadow, blurRadius: 10, offset: const Offset(0, 3))
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (var i = 0; i < rows; i++)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 7),
              child: Row(
                children: [
                  const SkeletonBox(width: 16, height: 16, radius: 4),
                  const SizedBox(width: 10),
                  Expanded(
                      child: SkeletonBox(
                          height: 11, width: 120 + (i * 20).toDouble())),
                ],
              ),
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
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(message,
                textAlign: TextAlign.center,
                style: const TextStyle(color: AppColors.coral)),
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
