# GradeMate
GradeMate is a React Native mobile application designed to help students track their school grades. It provides an easy and secure way to save grades locally on your device and automatically calculates averages based on the specific weighting rules used by the Galileo Galilei school.

The core feature of this application is its specialized grade calculation method. Unlike a simple average, it applies a weighted formula:
- **Written and Oral** grades account for **2/3** of the average.
- **Practical** grades account for **1/3** of the average.

## Features

- **Add Grades**: Easily add new grades by specifying the subject, grade value, type (written, oral, or practical), and academic period (trimester or pentamestre).
- **Weighted Average Calculation**: Automatically calculates the average for each subject using the 2/3 (written/oral) and 1/3 (practical) weighting.
- **Overall Average**: View your total average across all subjects for the selected period.
- **Persistent Local Storage**: Your grades are securely stored on your device using AsyncStorage, ensuring your data is private and available offline.
- **Detailed View**: Tap on a subject to see a detailed list of all recorded grades and their types.
- **Manage Grades**: Delete individual grades from the subject detail screen or clear all data from the home screen.
- **Period Toggling**: Switch the view between `trimestre` and `pentamestre` to see your performance in each academic period.
- **Dark Theme**: A clean, dark-themed user interface for comfortable viewing.

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Bottom Tabs and Stack)
- **Local Storage**: AsyncStorage
