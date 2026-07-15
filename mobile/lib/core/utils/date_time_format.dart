import 'package:flutter/material.dart';

// HH:mm
String formatTimeOfDay(TimeOfDay time) {
  final hour = time.hour.toString().padLeft(2, '0');
  final minute = time.minute.toString().padLeft(2, '0');
  return '$hour:$minute';
}

// YYYY-MM-DD
String formatDateYmd(DateTime date) {
  final year = date.year.toString().padLeft(4, '0');
  final month = date.month.toString().padLeft(2, '0');
  final day = date.day.toString().padLeft(2, '0');
  return '$year-$month-$day';
}

//DD/MM/YYYY
String formatDateDmy(DateTime date) {
  final day = date.day.toString().padLeft(2, '0');
  final month = date.month.toString().padLeft(2, '0');
  final year = date.year.toString().padLeft(4, '0');
  return '$day/$month/$year';
}

// showTimePicker forced to 24h regardless of system format
Future<void> pickTimeOfDay24h(
  BuildContext context, {
  required TimeOfDay? initial,
  required ValueChanged<TimeOfDay> onPicked,
}) async {
  final picked = await showTimePicker(
    context: context,
    initialTime: initial ?? TimeOfDay.now(),
    builder: (context, child) => MediaQuery(
      data: MediaQuery.of(context).copyWith(alwaysUse24HourFormat: true),
      child: child!,
    ),
  );
  if (picked != null) onPicked(picked);
}
