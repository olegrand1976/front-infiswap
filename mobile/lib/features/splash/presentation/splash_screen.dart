import 'package:flutter/material.dart';

import '../../../core/theme/app_colors.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/logo.png',
              height: 80,
              fit: BoxFit.contain,
            ),
            const SizedBox(height: 32),
            const CircularProgressIndicator(color: AppColors.mint),
          ],
        ),
      ),
    );
  }
}
