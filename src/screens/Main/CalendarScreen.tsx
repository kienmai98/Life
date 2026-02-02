import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, IconButton, useTheme, FAB, Chip, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';

import { useCalendarStore } from '../../stores/calendarStore';
import { CalendarEvent } from '../../types';
import { formatTime, isEventToday } from '../../utils/helpers';

const CalendarScreen: React.FC = () => {
  const theme = useTheme();
  const { events, scheduleSummary, fetchEvents, requestPermission, hasPermission, isLoading } = useCalendarStore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkPermissionAndFetch();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      fetchEvents(start, end);
    }, [currentDate])
  );

  const checkPermissionAndFetch = async () => {
    const granted = await requestPermission();
    if (granted) {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      await fetchEvents(start, end);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    await fetchEvents(start, end);
    setRefreshing(false);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return isSameDay(eventDate, date);
    });
  };

  const renderCalendarGrid = () => {
    const days = getDaysInMonth();
    const firstDayOfMonth = startOfMonth(currentDate).getDay();
    const paddingDays = Array(firstDayOfMonth).fill(null);

    return (
      <View style={styles.calendarGrid}>
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <View key={day} style={styles.dayHeader}>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {day}
            </Text>
          </View>
        ))}

        {/* Padding days */}
        {paddingDays.map((_, index) => (
          <View key={`padding-${index}`} style={styles.dayCell} />
        ))}

        {/* Actual days */}
        {days.map((day) => {
          const dayEvents = getEventsForDate(day);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <TouchableOpacity
              key={day.toISOString()}
              style={[
                styles.dayCell,
                isSelected && { backgroundColor: theme.colors.primaryContainer },
              ]}
              onPress={() => setSelectedDate(day)}
            >
              <View
                style={[
                  styles.dayContent,
                  isTodayDate && { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text
                  variant="bodyMedium"
                  style={{
                    color: isTodayDate
                      ? theme.colors.onPrimary
                      : isSelected
                      ? theme.colors.onPrimaryContainer
                      : theme.colors.onSurface,
                    fontWeight: isTodayDate || isSelected ? 'bold' : 'normal',
                  }}
                >
                  {format(day, 'd')}
                </Text>
              </View>
              
              {dayEvents.length > 0 && (
                <View style={styles.eventDots}>
                  {dayEvents.slice(0, 3).map((event, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.eventDot,
                        { backgroundColor: event.color || theme.colors.primary },
                      ]}
                    />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderEventItem = ({ item }: { item: CalendarEvent }) => (
    <Card style={styles.eventCard} mode="outlined">
      <Card.Content style={styles.eventCardContent}>
        <View
          style={[
            styles.eventColorIndicator,
            { backgroundColor: item.color || theme.colors.primary },
          ]}
        />
        <View style={styles.eventInfo}>
          <Text variant="titleSmall" numberOfLines={1}>
            {item.title}
          </Text>
          
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {item.isAllDay
              ? 'All day'
              : `${formatTime(item.startDate)} - ${formatTime(item.endDate)}`}
          </Text>
          
          {item.location && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              📍 {item.location}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const selectedDateEvents = getEventsForDate(selectedDate);

  if (!hasPermission) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.permissionContainer}>
          <Text variant="headlineSmall" style={{ textAlign: 'center', marginBottom: 16 }}>
            Calendar Access Needed
          </Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 24 }}>
            Please grant calendar access to view your schedule
          </Text>
          <IconButton
            icon="refresh"
            mode="contained"
            size={32}
            onPress={checkPermissionAndFetch}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={goToPreviousMonth} />
        <Text variant="titleLarge" style={{ fontWeight: '600' }}>
          {format(currentDate, 'MMMM yyyy')}
        </Text>
        <IconButton icon="chevron-right" onPress={goToNextMonth} />
      </View>

      <View style={styles.calendarContainer}>
        {renderCalendarGrid()}
      </View>

      <Divider style={styles.divider} />

      <View style={styles.eventsSection}>
        <View style={styles.eventsHeader}>
          <Text variant="titleMedium" style={{ fontWeight: '600' }}>
            {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMMM d')}
          </Text>
          <Chip compact>{selectedDateEvents.length} events</Chip>
        </View>

        <FlatList
          data={selectedDateEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                No events for this day
              </Text>
            </View>
          }
          contentContainerStyle={styles.eventsList}
        />
      </View>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => {
          // Navigate to add event
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  calendarContainer: {
    padding: 16,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayHeader: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  dayContent: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDots: {
    flexDirection: 'row',
    marginTop: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  divider: {
    marginHorizontal: 16,
  },
  eventsSection: {
    flex: 1,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  eventsList: {
    padding: 16,
    paddingTop: 0,
  },
  eventCard: {
    marginBottom: 8,
  },
  eventCardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  eventColorIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});

export default CalendarScreen;
