import 'dart:convert';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../features/shell/providers/shell_tab_index_provider.dart';
import '../../firebase_options.dart';
import '../router/app_router.dart';

const _androidChannel = AndroidNotificationChannel(
  'default_channel',
  'Notifications',
  description: 'Remplacements, candidatures et mises à jour InfiSwap.',
  importance: Importance.high,
);

final _localNotifications = FlutterLocalNotificationsPlugin();

bool get isFirebaseSupportedPlatform =>
    kIsWeb ||
    defaultTargetPlatform == TargetPlatform.android ||
    defaultTargetPlatform == TargetPlatform.iOS;

@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
}

class PushNotificationService {
  PushNotificationService(this._ref);

  final Ref _ref;
  bool _initialized = false;

  FirebaseMessaging get _messaging => FirebaseMessaging.instance;

  // Push (FCM) is only wired for Android/iOS — web push would need a VAPID
  // key and a service worker, out of scope for now.
  String? get platformName {
    if (defaultTargetPlatform == TargetPlatform.android) return 'android';
    if (defaultTargetPlatform == TargetPlatform.iOS) return 'ios';
    return null;
  }

  Future<void> initialize() async {
    if (_initialized || platformName == null) return;
    _initialized = true;

    await _localNotifications.initialize(
      settings: const InitializationSettings(
        android: AndroidInitializationSettings('@mipmap/ic_launcher'),
        iOS: DarwinInitializationSettings(),
      ),
      onDidReceiveNotificationResponse: (response) =>
          _handleTap(response.payload),
    );

    await _localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(_androidChannel);

    await _messaging.requestPermission(alert: true, badge: true, sound: true);

    FirebaseMessaging.onMessage.listen(_showForegroundNotification);
    FirebaseMessaging.onMessageOpenedApp.listen(
      (message) => _handleTap(jsonEncode(message.data)),
    );

    final initialMessage = await _messaging.getInitialMessage();
    if (initialMessage != null) {
      _handleTap(jsonEncode(initialMessage.data));
    }
  }

  Future<String?> getToken() =>
      platformName == null ? Future.value(null) : _messaging.getToken();

  Stream<String> get onTokenRefresh => _messaging.onTokenRefresh;

  void _showForegroundNotification(RemoteMessage message) {
    final notification = message.notification;
    if (notification == null) return;

    _localNotifications.show(
      id: notification.hashCode,
      title: notification.title,
      body: notification.body,
      notificationDetails: NotificationDetails(
        android: AndroidNotificationDetails(
          _androidChannel.id,
          _androidChannel.name,
          channelDescription: _androidChannel.description,
          importance: Importance.high,
          priority: Priority.high,
        ),
        iOS: const DarwinNotificationDetails(),
      ),
      payload: jsonEncode(message.data),
    );
  }

  void _handleTap(String? payload) {
    final target = _deepLinkTarget(payload);
    if (target != null) {
      _ref.read(appRouterProvider).go(target);
      return;
    }

    _ref.read(shellTabIndexProvider.notifier).state = 2;
    _ref.read(appRouterProvider).go('/home');
  }

  String? _deepLinkTarget(String? payload) {
    if (payload == null) return null;

    try {
      final data = jsonDecode(payload) as Map<String, dynamic>;
      final type = data['type']?.toString();
      if (type == null) return null;

      if (type.startsWith('replacement.')) {
        final id = data['replacement_id'];
        if (id != null) return '/replacements/$id?type=$type';
      } else if (type.startsWith('mission.')) {
        final id = data['mission_id'];
        if (id != null) return '/missions/$id?type=$type';
      }
    } catch (_) {}

    return null;
  }
}

final pushNotificationServiceProvider =
    Provider<PushNotificationService>((ref) {
  return PushNotificationService(ref);
});
