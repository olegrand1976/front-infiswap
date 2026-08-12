import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/date_time_format.dart';

/// Légende de section pour les groupes qui ne sont pas un champ de texte
/// (grille de pastilles, sélecteur de rôle) — les vrais champs portent leur
/// libellé via `InputDecoration.labelText`, comme sur l'écran de connexion.
class CreateFieldLabel extends StatelessWidget {
  const CreateFieldLabel(this.label, {super.key});

  final String label;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    return Text(
      label.toUpperCase(),
      style: TextStyle(
        color: colors.textSecondary,
        fontSize: 11,
        fontWeight: FontWeight.w700,
        letterSpacing: .4,
      ),
    );
  }
}

/// Champ « tap to pick » rendu avec `InputDecorator` pour reprendre au
/// pixel près le style des `TextField` du thème (`inputDecorationTheme`).
class CreateTimeField extends StatelessWidget {
  const CreateTimeField({
    super.key,
    required this.label,
    required this.value,
    required this.onTap,
  });

  final String label;
  final TimeOfDay? value;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: InputDecorator(
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: const Icon(Icons.schedule),
        ),
        child: Text(
          value != null ? formatTimeOfDay(value!) : '--:--',
          style: TextStyle(
            color: value != null ? colors.textPrimary : colors.textSecondary,
          ),
        ),
      ),
    );
  }
}

class CreateTagField extends StatelessWidget {
  const CreateTagField({
    super.key,
    required this.controller,
    required this.label,
    required this.hint,
    required this.icon,
    required this.tags,
    required this.onAdd,
    required this.onRemove,
    this.keyboardType,
  });

  final TextEditingController controller;
  final String label;
  final String hint;
  final IconData icon;
  final List<String> tags;
  final VoidCallback onAdd;
  final void Function(String tag) onRemove;
  final TextInputType? keyboardType;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: controller,
                keyboardType: keyboardType,
                textInputAction: TextInputAction.done,
                onSubmitted: (_) => onAdd(),
                decoration: InputDecoration(
                  labelText: label,
                  hintText: hint,
                  prefixIcon: Icon(icon),
                ),
              ),
            ),
            const SizedBox(width: 8),
            IconButton.filled(
              onPressed: onAdd,
              style: IconButton.styleFrom(
                backgroundColor: colors.primary,
                foregroundColor: colors.onPrimary,
              ),
              icon: const Icon(Icons.add),
            ),
          ],
        ),
        if (tags.isNotEmpty) ...[
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final tag in tags)
                InputChip(
                  label: Text(tag),
                  deleteIconColor: colors.textSecondary,
                  onDeleted: () => onRemove(tag),
                  backgroundColor: colors.primaryMuted,
                  side: BorderSide(color: colors.primaryOutline),
                  labelStyle: TextStyle(color: colors.primary),
                ),
            ],
          ),
        ],
      ],
    );
  }
}

class CreateTogglePill extends StatelessWidget {
  const CreateTogglePill({
    super.key,
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: selected ? colors.primary : colors.card,
          border: Border.all(color: selected ? colors.primary : colors.border),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selected ? colors.onPrimary : colors.textPrimary,
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
