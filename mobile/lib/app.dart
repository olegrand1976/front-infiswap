import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/data/auth_repository.dart';
import 'features/auth/providers/auth_session_provider.dart';

class InfiSwapApp extends ConsumerWidget {
  const InfiSwapApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ref.watch(authBootstrapProvider);

    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'InfiSwap',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark(),
      routerConfig: router,
    );
  }
}
