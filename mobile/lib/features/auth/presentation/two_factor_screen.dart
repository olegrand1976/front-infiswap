import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/router/app_router.dart';
import '../data/auth_repository.dart';
import '../models/auth_models.dart';
import '../providers/auth_session_provider.dart';

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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Vérification 2FA'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Icon(Icons.mark_email_read_outlined, size: 48),
                const SizedBox(height: 16),
                Text(
                  widget.args.message ??
                      'Entrez le code de vérification reçu par email ou SMS.',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                TextFormField(
                  controller: _codeController,
                  keyboardType: TextInputType.number,
                  textAlign: TextAlign.center,
                  inputFormatters: [
                    FilteringTextInputFormatter.digitsOnly,
                    LengthLimitingTextInputFormatter(6),
                  ],
                  decoration: const InputDecoration(
                    labelText: 'Code à 6 chiffres',
                  ),
                  validator: (value) {
                    if (value == null || value.length != 6) {
                      return 'Code à 6 chiffres requis';
                    }
                    return null;
                  },
                ),
                if (_errorMessage != null) ...[
                  const SizedBox(height: 16),
                  Text(
                    _errorMessage!,
                    style: TextStyle(color: Theme.of(context).colorScheme.error),
                  ),
                ],
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Valider'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
