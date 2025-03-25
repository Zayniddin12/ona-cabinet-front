<template>
  <div>
    <!-- Your component template here -->
  </div>
</template>

<script>
import ApiService from "@/core/services/ApiService";

export default {
  data() {
    return {
      lastActivityTime: Date.now(),
      trackingInterval: null,
      trackingDuration: 300000, // 5 minutes in milliseconds
      lastDataSendTime: Date.now(),
    };
  },
  mounted() {
    // Start tracking user activity
    this.startTracking();
  },
  beforeUnmount() {
    // Stop tracking user activity when component is destroyed
    this.stopTracking();
  },
  methods: {
    startTracking() {
      // Set up event listeners to track user activity
      window.addEventListener("mousemove", this.updateLastActivityTime);
      window.addEventListener("keydown", this.updateLastActivityTime);

      // Start checking for inactivity
      this.trackingInterval = setInterval(() => {
        const timeSinceLastActivity = Date.now() - this.lastActivityTime;
        if (timeSinceLastActivity >= this.trackingDuration) {
          // Stop tracking if there is no activity for 5 minutes
          this.stopTracking();
        } else if (
          timeSinceLastActivity >= 60000 &&
          Date.now() - this.lastDataSendTime >= 60000
        ) {
          // Send activity data to the server every minute

          this.sendActivityDataToServer();
          this.lastDataSendTime = Date.now();
        }
      }, 1000); // Check for inactivity every second
    },
    stopTracking() {
      // Clear event listeners and tracking interval
      window.removeEventListener("mousemove", this.updateLastActivityTime);
      window.removeEventListener("keydown", this.updateLastActivityTime);
      clearInterval(this.trackingInterval);

      // Send final activity data to the server before stopping tracking
      this.sendActivityDataToServer();
    },
    updateLastActivityTime() {
      // Update last activity time whenever there is mouse or keyboard activity
      this.lastActivityTime = Date.now();
    },
    sendActivityDataToServer() {
      // Send activity data to the server via an HTTP request

      ApiService.post("api/v2/main/UserTracking", {})
        .then((response) => {
          // Handle response from server if necessary
        })
        .catch((error) => {
          console.log(error);

          // Handle error if necessary
        });
    },
  },
};
</script>
