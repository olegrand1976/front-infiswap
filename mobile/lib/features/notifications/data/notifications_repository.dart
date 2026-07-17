import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_client.dart';
import '../models/notification_item.dart';

class NotificationsPage {
  const NotificationsPage({required this.items, required this.total});

  final List<NotificationItem> items;
  final int total;
}

class NotificationsRepository {
  NotificationsRepository({required ApiClient apiClient}) : _api = apiClient;

  final ApiClient _api;

  Future<NotificationsPage> fetchPage({
    int page = 1,
    int perPage = 25,
    bool unreadOnly = false,
  }) async {
    final response = await _api.get<Map<String, dynamic>>(
      '/notifications',
      queryParameters: {
        'page': page,
        'perPage': perPage,
        if (unreadOnly) 'unread_only': true,
      },
    );

    final data = response.data?['data'];
    final items = data is List
        ? data
            .whereType<Map>()
            .map((item) => NotificationItem.fromJson(
                  item.map((key, value) => MapEntry(key.toString(), value)),
                ))
            .toList()
        : <NotificationItem>[];

    final meta = response.data?['meta'];
    final total = meta is Map
        ? int.tryParse(meta['total']?.toString() ?? '') ?? items.length
        : items.length;

    return NotificationsPage(items: items, total: total);
  }

  Future<int> unreadCount({String? type}) async {
    final response = await _api.get<Map<String, dynamic>>(
      '/notifications/unread-count',
      queryParameters: {if (type != null) 'type': type},
    );

    return int.tryParse(response.data?['count']?.toString() ?? '') ?? 0;
  }

  Future<void> markAsRead(int notificationId) async {
    await _api.put<Map<String, dynamic>>('/notifications/$notificationId/read');
  }

  Future<void> markAllAsRead() async {
    await _api.put<Map<String, dynamic>>('/notifications/mark-all-read');
  }

  Future<void> delete(int notificationId) async {
    await _api.delete<void>('/notifications/$notificationId');
  }
}

final notificationsRepositoryProvider = Provider<NotificationsRepository>((ref) {
  return NotificationsRepository(apiClient: ref.watch(apiClientProvider));
});
