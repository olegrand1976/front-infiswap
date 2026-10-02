import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radii.dart';
import '../../models/network_member.dart';

class NetworkMemberSheet extends StatelessWidget {
  const NetworkMemberSheet({super.key, required this.member});

  final NetworkMember member;

  static Future<void> show(
    BuildContext context, {
    required NetworkMember member,
  }) {
    return showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => NetworkMemberSheet(member: member),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius:
            const BorderRadius.vertical(top: Radius.circular(AppRadii.md)),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                    color: colors.divider,
                    borderRadius: BorderRadius.circular(999)),
              ),
              const SizedBox(height: 20),
              CircleAvatar(
                radius: 28,
                backgroundColor: colors.primaryMuted,
                child: Text(
                  member.initials,
                  style: TextStyle(
                      color: colors.primary,
                      fontSize: 18,
                      fontWeight: FontWeight.w800),
                ),
              ),
              const SizedBox(height: 10),
              Text(
                member.fullName,
                textAlign: TextAlign.center,
                style: TextStyle(
                    color: colors.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w800),
              ),
              if (member.location.isNotEmpty) ...[
                const SizedBox(height: 4),
                Text(
                  member.location,
                  style: TextStyle(color: colors.textSecondary, fontSize: 12.5),
                ),
              ],
              const SizedBox(height: 20),
              if (member.phone.isNotEmpty)
                _ContactRow(
                  icon: Icons.phone_outlined,
                  value: member.phone,
                  onTap: () =>
                      launchUrl(Uri(scheme: 'tel', path: member.phone)),
                ),
              if (member.email.isNotEmpty) ...[
                const SizedBox(height: 8),
                _ContactRow(
                  icon: Icons.mail_outline,
                  value: member.email,
                  onTap: () =>
                      launchUrl(Uri(scheme: 'mailto', path: member.email)),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _ContactRow extends StatelessWidget {
  const _ContactRow({
    required this.icon,
    required this.value,
    required this.onTap,
  });

  final IconData icon;
  final String value;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadii.md),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          border: Border.all(color: colors.border),
          borderRadius: BorderRadius.circular(AppRadii.md),
        ),
        child: Row(
          children: [
            Icon(icon, size: 18, color: colors.primary),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                value,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                    color: colors.textPrimary,
                    fontSize: 13,
                    fontWeight: FontWeight.w600),
              ),
            ),
            Icon(Icons.chevron_right, size: 18, color: colors.textSecondary),
          ],
        ),
      ),
    );
  }
}
