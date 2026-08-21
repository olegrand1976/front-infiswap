import 'package:flutter/material.dart';

class NotificationItem {
  const NotificationItem({
    required this.id,
    required this.type,
    required this.data,
    required this.createdAt,
    this.readAt,
  });

  final int id;
  final String type;
  final Map<String, dynamic> data;
  final DateTime createdAt;
  final DateTime? readAt;

  bool get isRead => readAt != null;

  factory NotificationItem.fromJson(Map<String, dynamic> json) {
    final rawData = json['data'];
    return NotificationItem(
      id: int.tryParse(json['id'].toString()) ?? 0,
      type: json['type']?.toString() ?? '',
      data: rawData is Map
          ? rawData.map((key, value) => MapEntry(key.toString(), value))
          : const {},
      createdAt: DateTime.tryParse(json['created_at']?.toString() ?? '') ??
          DateTime.now(),
      readAt: json['read_at'] != null
          ? DateTime.tryParse(json['read_at'].toString())
          : null,
    );
  }
}

class NotificationContent {
  const NotificationContent({required this.title, required this.body});

  final String title;
  final String body;
}

// Mirrors the server-side title/body mapping (NotificationService::pushContentFor)
// so notifications fetched via the API render the same way they would as a push.
NotificationContent notificationContentFor(NotificationItem item) {
  final data = item.data;
  String field(String key) => data[key]?.toString() ?? '';
  bool has(String key) => field(key).isNotEmpty;

  switch (item.type) {
    case 'replacement.new':
      return NotificationContent(
        title: 'Nouveau remplacement',
        body: 'Un remplacement est disponible'
            '${has('city') ? ' à ${field('city')}' : ''}.',
      );
    case 'replacement.response':
      return NotificationContent(
        title: 'Nouvelle candidature',
        body:
            '${has('nurse_name') ? field('nurse_name') : 'Quelqu\'un'} a postulé à votre remplacement.',
      );
    case 'replacement.accepted':
      return const NotificationContent(
        title: 'Candidature acceptée',
        body: 'Votre candidature a été acceptée.',
      );
    case 'replacement.refused':
      return const NotificationContent(
        title: 'Candidature refusée',
        body: 'Votre candidature a été refusée.',
      );
    case 'replacement.canceled':
      return NotificationContent(
        title: 'Candidature annulée',
        body:
            '${has('nurse_name') ? field('nurse_name') : 'Le candidat'} a annulé sa candidature.',
      );
    case 'replacement.closed':
      return NotificationContent(
        title: 'Remplacement clôturé',
        body: has('message')
            ? field('message')
            : 'Le remplacement a été clôturé.',
      );
    case 'mission.new':
      return NotificationContent(
        title: 'Nouvelle mission',
        body: 'Mission disponible'
            '${has('institution_name') ? ' chez ${field('institution_name')}' : ''}.',
      );
    case 'mission.candidate':
      return NotificationContent(
        title: 'Nouvelle candidature',
        body:
            '${has('candidate_name') ? field('candidate_name') : 'Quelqu\'un'} a postulé à votre mission.',
      );
    case 'mission.accepted':
      return const NotificationContent(
        title: 'Mission acceptée',
        body: 'Votre candidature à la mission a été acceptée.',
      );
    case 'mission.rejected':
      return const NotificationContent(
        title: 'Mission refusée',
        body: 'Votre candidature à la mission a été refusée.',
      );
    case 'partnership.request':
      return const NotificationContent(
        title: 'Binôme',
        body: 'Votre demande de binôme a été publiée.',
      );
    case 'pairing.new_request':
      return NotificationContent(
        title: 'Nouvelle demande de binôme',
        body: 'Une demande de binôme est disponible'
            '${has('city') ? ' à ${field('city')}' : ''}.',
      );
    default:
      return NotificationContent(
        title: has('title') ? field('title') : 'Notification',
        body: field('body'),
      );
  }
}

bool isOwnerNotificationType(String type) {
  const ownerTypes = {'replacement.response', 'replacement.canceled'};
  return ownerTypes.contains(type);
}

IconData notificationIconFor(String type) {
  switch (type) {
    case 'replacement.new':
    case 'mission.new':
    case 'pairing.new_request':
      return Icons.campaign_outlined;
    case 'replacement.response':
    case 'mission.candidate':
      return Icons.groups_outlined;
    case 'replacement.accepted':
    case 'mission.accepted':
      return Icons.check_circle_outline;
    case 'replacement.refused':
    case 'mission.rejected':
      return Icons.cancel_outlined;
    case 'replacement.canceled':
      return Icons.undo_outlined;
    case 'replacement.closed':
      return Icons.lock_outline;
    case 'partnership.request':
      return Icons.handshake_outlined;
    default:
      return Icons.notifications_outlined;
  }
}
