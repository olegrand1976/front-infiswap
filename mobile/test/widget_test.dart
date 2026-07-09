import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:infiswap_mobile/app.dart';
import 'package:infiswap_mobile/features/auth/data/auth_repository.dart';

void main() {
  testWidgets('affiche l écran de connexion', (WidgetTester tester) async {
    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          // Évite l'appel API au démarrage pendant les tests.
          authBootstrapProvider.overrideWith((ref) async {}),
        ],
        child: const InfiSwapApp(),
      ),
    );

    await tester.pumpAndSettle();

    expect(find.text('Bienvenue'), findsOneWidget);
    expect(find.text('Se connecter'), findsOneWidget);
  });
}
