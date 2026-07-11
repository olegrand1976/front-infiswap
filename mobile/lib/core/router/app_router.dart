import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/applications/presentation/applications_screen.dart';
import '../../features/auth/data/auth_repository.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/auth/presentation/two_factor_screen.dart';
import '../../features/auth/providers/auth_session_provider.dart';
import '../../features/shell/presentation/main_shell.dart';
import '../../features/splash/presentation/splash_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authSession = ref.watch(authSessionProvider);
  final bootstrap = ref.watch(authBootstrapProvider);

  return GoRouter(
    initialLocation: '/splash',
    refreshListenable: _RouterRefresh(ref),
    redirect: (context, state) {
      final isBootstrapping = bootstrap.isLoading;
      final isAuthenticated = authSession != null;
      final location = state.matchedLocation;

      if (isBootstrapping) {
        return location == '/splash' ? null : '/splash';
      }

      final isAuthRoute =
          location == '/login' || location.startsWith('/two-factor');

      if (!isAuthenticated && !isAuthRoute && location != '/splash') {
        return '/login';
      }

      if (isAuthenticated && (isAuthRoute || location == '/splash')) {
        return '/home';
      }

      if (!isAuthenticated && location == '/splash') {
        return '/login';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/two-factor',
        builder: (context, state) {
          final extra = state.extra;
          if (extra is! TwoFactorRouteArgs) {
            return const LoginScreen();
          }
          return TwoFactorScreen(args: extra);
        },
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) => const MainShell(),
      ),
      GoRoute(
        path: '/applications',
        builder: (context, state) => const ApplicationsScreen(),
      ),
    ],
  );
});

class TwoFactorRouteArgs {
  const TwoFactorRouteArgs({
    required this.hash,
    this.message,
  });

  final String hash;
  final String? message;
}

class _RouterRefresh extends ChangeNotifier {
  _RouterRefresh(this.ref) {
    ref.listen(authSessionProvider, (_, __) => notifyListeners());
    ref.listen(authBootstrapProvider, (_, __) => notifyListeners());
  }

  final Ref ref;
}
