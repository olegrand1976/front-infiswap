import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show PlatformException;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_web_auth_2/flutter_web_auth_2.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../subscription/data/subscription_repository.dart';
import '../../../subscription/models/boost_plan.dart';
import '../../data/my_replacements_list_notifier.dart';
import '../../models/replacement_item.dart';
import '../../../../core/theme/app_radii.dart';

const _boostCallbackScheme = 'infiswapmobile';

class ReplacementBoostSheet extends ConsumerStatefulWidget {
  const ReplacementBoostSheet({super.key, required this.item});

  final ReplacementItem item;

  static Future<void> show(BuildContext context, ReplacementItem item) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ReplacementBoostSheet(item: item),
    );
  }

  @override
  ConsumerState<ReplacementBoostSheet> createState() =>
      _ReplacementBoostSheetState();
}

class _ReplacementBoostSheetState extends ConsumerState<ReplacementBoostSheet> {
  int? _selectedPlanId;
  bool _loading = false;
  String? _pendingWebCheckoutUrl;

  Future<void> _confirm(List<BoostPlan> plans) async {
    if (_loading || plans.isEmpty) {
      return;
    }
    final planId = _selectedPlanId ?? plans.first.id;
    final replacementId = int.tryParse(widget.item.id);
    if (replacementId == null) {
      return;
    }

    setState(() => _loading = true);

    final repository = ref.read(subscriptionRepositoryProvider);

    try {
      final checkoutUrl = await repository.createReplacementBoostCheckout(
        replacementId: replacementId,
        planId: planId,
        platform: 'mobile',
        returnOrigin: kIsWeb ? Uri.base.origin : null,
      );

      if (kIsWeb) {
        if (!mounted) return;
        setState(() {
          _pendingWebCheckoutUrl = checkoutUrl;
          _loading = false;
        });
        return;
      }

      await _openAndAwaitResult(checkoutUrl, replacementId);
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(error.message)));
    } catch (_) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Une erreur est survenue.')),
      );
    }
  }

  Future<void> _openAndAwaitResult(
      String checkoutUrl, int replacementId) async {
    setState(() {
      _loading = true;
      _pendingWebCheckoutUrl = null;
    });

    final repository = ref.read(subscriptionRepositoryProvider);

    try {
      final callback = await FlutterWebAuth2.authenticate(
        url: checkoutUrl,
        callbackUrlScheme: kIsWeb ? 'https' : _boostCallbackScheme,
      );

      final params = Uri.parse(callback).queryParameters;
      final sessionId = params['session_id'];

      if (params['status'] == 'success' && sessionId != null) {
        final confirmed = await repository.confirmReplacementBoost(
          replacementId: replacementId,
          sessionId: sessionId,
        );
        ref.invalidate(myReplacementsListProvider);
        if (!mounted) return;
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              confirmed
                  ? 'Mise en avant activée.'
                  : 'Paiement reçu, activation en cours — actualisez dans quelques instants.',
            ),
          ),
        );
        return;
      }

      if (!mounted) return;
      setState(() => _loading = false);
    } on ApiException catch (error) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(error.message)));
    } on PlatformException catch (error) {
      if (!mounted) return;
      setState(() => _loading = false);
      if (error.code != 'CANCELED') {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(error.message ?? 'Le paiement a échoué.')),
        );
      }
    } catch (_) {
      if (!mounted) return;
      setState(() => _loading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Une erreur est survenue.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final asyncPlans = ref.watch(replacementBoostPlansProvider);
    final alreadyBoosted = widget.item.isBoosted;

    return SafeArea(
      top: false,
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
        padding: const EdgeInsets.fromLTRB(22, 24, 22, 18),
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius: BorderRadius.circular(AppRadii.md),
          boxShadow: [
            BoxShadow(
                color: colors.shadow,
                blurRadius: 24,
                offset: const Offset(0, -6)),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                color: colors.primaryMuted,
                borderRadius: BorderRadius.circular(AppRadii.md),
              ),
              child: Icon(Icons.trending_up, color: colors.primary),
            ),
            const SizedBox(height: 14),
            Text(
              alreadyBoosted
                  ? 'Prolonger la mise en avant'
                  : 'Mettez ce remplacement en avant',
              textAlign: TextAlign.center,
              style: TextStyle(
                  color: colors.textPrimary,
                  fontSize: 17,
                  fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 8),
            Text(
              alreadyBoosted
                  ? 'Un nouvel achat prolonge la durée de mise en avant actuelle.'
                  : 'Votre annonce apparaît en tête de liste pendant la durée choisie.',
              textAlign: TextAlign.center,
              style: TextStyle(
                  color: colors.textSecondary, fontSize: 13.5, height: 1.4),
            ),
            const SizedBox(height: 18),
            asyncPlans.when(
              loading: () => const Padding(
                padding: EdgeInsets.symmetric(vertical: 24),
                child: CircularProgressIndicator(),
              ),
              error: (_, __) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Text(
                  "Impossible de charger les options pour l'instant.",
                  textAlign: TextAlign.center,
                  style: TextStyle(color: colors.textSecondary, fontSize: 13),
                ),
              ),
              data: (plans) {
                if (plans.isEmpty) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    child: Text(
                      'Aucune option de mise en avant disponible pour le moment.',
                      textAlign: TextAlign.center,
                      style:
                          TextStyle(color: colors.textSecondary, fontSize: 13),
                    ),
                  );
                }
                _selectedPlanId ??= plans.first.id;

                return Column(
                  children: [
                    for (final plan in plans) ...[
                      _BoostPlanTile(
                        plan: plan,
                        selected: _selectedPlanId == plan.id,
                        onTap: () => setState(() => _selectedPlanId = plan.id),
                      ),
                      const SizedBox(height: 8),
                    ],
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: _loading
                                ? null
                                : () => Navigator.of(context).pop(),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: colors.textPrimary,
                              side: BorderSide(color: colors.border),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                            child: const Text('Plus tard'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          flex: 2,
                          child: ElevatedButton(
                            onPressed: _loading
                                ? null
                                : _pendingWebCheckoutUrl != null
                                    ? () => _openAndAwaitResult(
                                          _pendingWebCheckoutUrl!,
                                          int.parse(widget.item.id),
                                        )
                                    : () => _confirm(plans),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: colors.primary,
                              foregroundColor: colors.onPrimary,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                            ),
                            child: _loading
                                ? const SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2.2,
                                      valueColor:
                                          AlwaysStoppedAnimation(AppColors.white),
                                    ),
                                  )
                                : Text(
                                    _pendingWebCheckoutUrl != null
                                        ? 'Payer maintenant'
                                        : 'Continuer',
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ],
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _BoostPlanTile extends StatelessWidget {
  const _BoostPlanTile(
      {required this.plan, required this.selected, required this.onTap});

  final BoostPlan plan;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadii.md),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            color: selected ? colors.primaryMuted : colors.background,
            border: Border.all(
                color: selected ? colors.primaryOutline : colors.border),
            borderRadius: BorderRadius.circular(AppRadii.md),
          ),
          child: Row(
            children: [
              Icon(
                selected
                    ? Icons.radio_button_checked
                    : Icons.radio_button_unchecked,
                color: selected ? colors.primary : colors.textSecondary,
                size: 20,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  plan.durationLabel,
                  style: TextStyle(
                      color: colors.textPrimary,
                      fontSize: 14,
                      fontWeight: FontWeight.w600),
                ),
              ),
              Text(
                plan.formattedAmount,
                style: TextStyle(
                    color: colors.primary,
                    fontSize: 15,
                    fontWeight: FontWeight.w800),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
