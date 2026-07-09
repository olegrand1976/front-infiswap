import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class ReplacementsScreen extends StatelessWidget {
  const ReplacementsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Remplacements'),
        backgroundColor: AppColors.background,
        foregroundColor: AppColors.textPrimary,
      ),
      body: const Center(
        child: Text(
          'Liste des remplacements',
          style: TextStyle(
            color: AppColors.textPrimary,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
