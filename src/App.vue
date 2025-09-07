<template>
  <div class="app">
    <header class="header">
      <nav class="nav">
        <router-link to="/groceries" class="nav-item" :class="{ active: $route.path === '/groceries' }">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5-5M7 13l-2.5 5M17 17a2 2 0 100 4 2 2 0 000-4zM9 17a2 2 0 100 4 2 2 0 000-4z"/>
          </svg>
          <span>List</span>
        </router-link>
        
        <router-link to="/add" class="nav-item" :class="{ active: $route.path === '/add' }">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <span>Add</span>
        </router-link>
        
        <router-link to="/settings" class="nav-item" :class="{ active: $route.path === '/settings' }">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          <span>Settings</span>
        </router-link>
      </nav>
    </header>

    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

.header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.nav {
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  max-width: 480px;
  margin: 0 auto;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #64748b;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
  min-width: 60px;
}

.nav-item:hover {
  background-color: #f1f5f9;
  color: #4ade80;
}

.nav-item.active {
  color: #4ade80;
  background-color: #f0fdf4;
}

.nav-icon {
  width: 24px;
  height: 24px;
  stroke-width: 2;
  margin-bottom: 4px;
}

.nav-item span {
  font-size: 12px;
  font-weight: 500;
}

.main {
  flex: 1;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
}

@media (max-width: 480px) {
  .main {
    padding: 0 12px;
  }
}
</style>
