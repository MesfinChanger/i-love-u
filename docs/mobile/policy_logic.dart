
/**
 * @fileOverview Universal Policy Bridge - Mobile Branch.
 * This file serves as the technical blueprint for Flutter implementations.
 * Reaching every heart in every village with zero-lag logic.
 */

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/**
 * PROTOCOL: Policy Persistence
 * Saves the mandatory agreement to local storage for a snappy user experience.
 */
void acceptPolicy(BuildContext context) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  // Save the commitment to local persistence
  await prefs.setBool('has_accepted_policy', true);
  
  // Instant transition to the app hub (Discovery)
  Navigator.pushReplacementNamed(context, '/home');
}

/**
 * PROTOCOL: Snap-Check
 * Checks if the heart has already aligned with our mission to avoid redundant screens.
 */
void checkPolicyAgreement(BuildContext context) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  bool hasAccepted = prefs.getBool('has_accepted_policy') ?? false;

  if (hasAccepted) {
    // Already aligned! Fast-track to the Prosperity Network.
    Navigator.pushReplacementNamed(context, '/home');
  } else {
    // First encounter or new device: Present the Sacred Agreement.
    Navigator.pushReplacementNamed(context, '/disclaimer_screen');
  }
}

/**
 * NOTE: Ensure 'shared_preferences: ^2.2.5' is in your pubspec.yaml.
 * Happiness is Mandatory. ❤️
 */
