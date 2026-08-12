import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/router/app_router.dart';
import '../../../core/theme/app_colors.dart';
import '../data/auth_repository.dart';
import '../models/auth_models.dart';
import '../providers/auth_session_provider.dart';
import '../../../core/theme/app_radii.dart';

class TwoFactorScreen extends ConsumerStatefulWidget {
  const TwoFactorScreen({
    super.key,
    required this.args,
  });

  final TwoFactorRouteArgs args;

  @override
  ConsumerState<TwoFactorScreen> createState() => _TwoFactorScreenState();
}

class _TwoFactorScreenState extends ConsumerState<TwoFactorScreen> {
  final _formKey = GlobalKey<FormState>();
  final _codeController = TextEditingController();

  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final repository = ref.read(authRepositoryProvider);
      final result = await repository.verifyTwoFactor(
        hash: widget.args.hash,
        code: _codeController.text,
      );

      ref.read(authSessionProvider.notifier).state = AuthSession(
        token: result.token,
        user: result.user,
      );

      if (mounted) {
        context.go('/home');
      }
    } on ApiException catch (error) {
      setState(() => _errorMessage = error.message);
    } catch (_) {
      setState(() => _errorMessage = 'Vérification impossible. Réessayez.');
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Scaffold(
      body: Stack(
        children: [
          Positioned(
            top: -80,
            left: -60,
            child: _GlowCircle(
              color: AppColors.mint.withValues(alpha: 0.15),
              size: 220,
            ),
          ),
          Positioned(
            bottom: 100,
            right: -40,
            child: _GlowCircle(
              color: AppColors.coral.withValues(alpha: 0.12),
              size: 180,
            ),
          ),
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const SizedBox(height: 8),
                      Image.asset(
                        'assets/images/logo.png',
                        height: 72,
                        fit: BoxFit.contain,
                      ),
                      const SizedBox(height: 32),
                      Text(
                        'Vérification',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: colors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Entrez le code à 6 chiffres',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          color: colors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 32),
                      TextFormField(
                        controller: _codeController,
                        keyboardType: TextInputType.number,
                        textAlign: TextAlign.center,
                        textInputAction: TextInputAction.done,
                        onFieldSubmitted: (_) => _submit(),
                        style: TextStyle(
                          color: colors.textPrimary,
                          fontSize: 24,
                          letterSpacing: 8,
                          fontWeight: FontWeight.w600,
                        ),
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                          LengthLimitingTextInputFormatter(6),
                        ],
                        decoration: InputDecoration(
                          labelText: 'Code à 6 chiffres',
                          prefixIcon: Icon(
                            Icons.lock_outline,
                            color: colors.primary,
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.length != 6) {
                            return 'Le code doit contenir 6 chiffres';
                          }
                          return null;
                        },
                      ),
                      if (_errorMessage != null) ...[
                        const SizedBox(height: 16),
                        Text(
                          _errorMessage!,
                          textAlign: TextAlign.center,
                          style: const TextStyle(color: AppColors.coral),
                        ),
                      ],
                      const SizedBox(height: 24),
                      DecoratedBox(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(AppRadii.md),
                          color: colors.primary,
                          boxShadow: [
                            BoxShadow(
                              color: colors.primary.withValues(alpha: 0.3),
                              blurRadius: 16,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _submit,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            foregroundColor: colors.onPrimary,
                            shadowColor: Colors.transparent,
                            elevation: 0,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                          ),
                          child: _isLoading
                              ? SizedBox(
                                  height: 22,
                                  width: 22,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: colors.onPrimary,
                                  ),
                                )
                              : const Text(
                                  'Valider le code',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextButton(
                        onPressed: () => context.go('/login'),
                        style: TextButton.styleFrom(
                          splashFactory: NoSplash.splashFactory,
                          overlayColor: Colors.transparent,
                        ),
                        child: Text(
                          'Retour à la connexion',
                          style: TextStyle(color: colors.primary),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _GlowCircle extends StatelessWidget {
  const _GlowCircle({required this.color, required this.size});

  final Color color;
  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color,
      ),
    );
  }
}
