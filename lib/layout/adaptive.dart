import 'package:flutter/material.dart';
import 'package:adaptive_breakpoints/adaptive_breakpoints.dart';

bool isDesktop(BuildContext context) =>
    getWindowType(context) >= AdaptiveWindowType.medium;

bool isTablet(BuildContext context) {
  return getWindowType(context) == AdaptiveWindowType.medium;
}