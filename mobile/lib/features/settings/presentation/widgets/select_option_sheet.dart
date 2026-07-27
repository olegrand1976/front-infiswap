import 'package:flutter/material.dart';

import 'settings_sheet_scaffold.dart';

/// Generic single-choice picker — returns the selected value, or null if
/// dismissed without a choice.
Future<T?> showSelectOptionSheet<T>({
  required BuildContext context,
  required String title,
  required List<(T value, String label)> options,
  required T? initial,
}) {
  return showSettingsSheet<T>(
    context: context,
    title: title,
    bodyBuilder: (context) => _SelectOptionList<T>(options: options, initial: initial),
  );
}

class _SelectOptionList<T> extends StatelessWidget {
  const _SelectOptionList({required this.options, required this.initial});

  final List<(T value, String label)> options;
  final T? initial;

  @override
  Widget build(BuildContext context) {
    return RadioGroup<T>(
      groupValue: initial,
      onChanged: (selected) => Navigator.of(context).pop(selected),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          for (final (value, label) in options)
            RadioListTile<T>(
              contentPadding: EdgeInsets.zero,
              title: Text(label),
              value: value,
            ),
        ],
      ),
    );
  }
}
