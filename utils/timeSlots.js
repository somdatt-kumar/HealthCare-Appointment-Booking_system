/**
 * Generate time slots between start and end time with given duration
 * @param {string} startTime - Format: 'HH:MM'
 * @param {string} endTime - Format: 'HH:MM'
 * @param {number} duration - In minutes
 * @returns {string[]} Array of time slots
 */
exports.generateSlots = (startTime, endTime, duration) => {
  const slots = [];
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMinute = startMinute;
  
  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    // Format time with leading zeros
    const formattedHour = currentHour.toString().padStart(2, '0');
    const formattedMinute = currentMinute.toString().padStart(2, '0');
    slots.push(`${formattedHour}:${formattedMinute}`);
    
    // Add duration
    currentMinute += duration;
    
    // Handle hour overflow
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }
  
  return slots;
};

/**
 * Convert time string to minutes since midnight
 * @param {string} time - Format: 'HH:MM'
 * @returns {number} Minutes since midnight
 */
exports.timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Check if time slot is valid (between start and end time)
 * @param {string} slot - Time slot to check (Format: 'HH:MM')
 * @param {string} startTime - Start time (Format: 'HH:MM')
 * @param {string} endTime - End time (Format: 'HH:MM')
 * @returns {boolean} True if valid, false otherwise
 */
exports.isValidSlot = (slot, startTime, endTime) => {
  const slotMinutes = this.timeToMinutes(slot);
  const startMinutes = this.timeToMinutes(startTime);
  const endMinutes = this.timeToMinutes(endTime);
  
  return slotMinutes >= startMinutes && slotMinutes <= endMinutes;
};

/**
 * Check if two time slots overlap
 * @param {string} slot1 - First time slot (Format: 'HH:MM')
 * @param {number} duration1 - Duration of first slot in minutes
 * @param {string} slot2 - Second time slot (Format: 'HH:MM')
 * @param {number} duration2 - Duration of second slot in minutes
 * @returns {boolean} True if slots overlap, false otherwise
 */
exports.doSlotsOverlap = (slot1, duration1, slot2, duration2) => {
  const slot1Start = this.timeToMinutes(slot1);
  const slot1End = slot1Start + duration1;
  const slot2Start = this.timeToMinutes(slot2);
  const slot2End = slot2Start + duration2;
  
  return (
    (slot1Start >= slot2Start && slot1Start < slot2End) ||
    (slot2Start >= slot1Start && slot2Start < slot1End)
  );
};