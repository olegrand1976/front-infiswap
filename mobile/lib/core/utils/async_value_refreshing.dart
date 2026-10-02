import 'package:flutter_riverpod/flutter_riverpod.dart';

extension AsyncValueRefreshing<T> on AsyncValue<T> {
  AsyncValue<T> get refreshing => AsyncLoading<T>().copyWithPrevious(this);
}
