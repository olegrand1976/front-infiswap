import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/settings_repository.dart';
import 'settings_sheet_scaffold.dart';

class DataExportSection extends StatefulWidget {
  const DataExportSection({
    super.key,
    required this.repository,
    required this.userId,
  });

  final SettingsRepository repository;
  final int userId;

  @override
  State<DataExportSection> createState() => _DataExportSectionState();
}

class _DataExportSectionState extends State<DataExportSection> {
  bool _isExporting = false;

  Future<void> _export() async {
    setState(() => _isExporting = true);
    try {
      final data = await widget.repository.exportPersonalData(widget.userId);
      final bytes = utf8.encode(const JsonEncoder.withIndent('  ').convert(data));
      await SharePlus.instance.share(
        ShareParams(
          files: [XFile.fromData(bytes, mimeType: 'application/json')],
          fileNameOverrides: ['infiswap-data-export-${widget.userId}.json'],
        ),
      );
    } on ApiException catch (error) {
      if (mounted) showSettingsErrorSnackBar(context, error.message);
    } catch (_) {
      if (mounted) showSettingsErrorSnackBar(context, 'Impossible d’exporter vos données.');
    } finally {
      if (mounted) setState(() => _isExporting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Téléchargez une copie de vos données (portabilité). InfiSwap ne revend pas vos données.',
          style: TextStyle(color: colors.textSecondary, fontSize: 12, height: 1.5),
        ),
        const SizedBox(height: 12),
        OutlinedButton.icon(
          onPressed: _isExporting ? null : _export,
          icon: _isExporting
              ? SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2, color: colors.primary),
                )
              : Icon(Icons.download_outlined, size: 18, color: colors.primary),
          label: Text(
            'Exporter mes données',
            style: TextStyle(color: colors.primary, fontWeight: FontWeight.w800),
          ),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size.fromHeight(44),
            side: BorderSide(color: colors.primaryOutline),
          ),
        ),
      ],
    );
  }
}
