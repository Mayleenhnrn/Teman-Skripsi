<script setup>
import { ref, computed } from 'vue'
import { useProgressStore } from '../stores/progress'

const progressStore = useProgressStore()

const expandedChapter = ref(null)
const newTaskName = ref('')
const addingTaskTo = ref(null)

const toggleChapter = (chapterId) => {
  if (expandedChapter.value === chapterId) {
    expandedChapter.value = null
  } else {
    expandedChapter.value = chapterId
  }
}

const handleToggleTask = (chapterId, taskId) => {
  progressStore.toggleTask(chapterId, taskId)
}

const startAddTask = (chapterId) => {
  addingTaskTo.value = chapterId
  newTaskName.value = ''
}

const cancelAddTask = () => {
  addingTaskTo.value = null
  newTaskName.value = ''
}

const submitAddTask = (chapterId) => {
  if (newTaskName.value.trim()) {
    progressStore.addTask(chapterId, newTaskName.value.trim())
    cancelAddTask()
  }
}

const handleRemoveTask = (chapterId, taskId) => {
  if (confirm('Apakah kamu yakin ingin menghapus task ini?')) {
    progressStore.removeTask(chapterId, taskId)
  }
}

const getProgressColor = (progress) => {
  if (progress >= 100) return '#22C55E'
  if (progress >= 75) return '#84CC16'
  if (progress >= 50) return '#EAB308'
  if (progress >= 25) return '#F97316'
  return '#EF4444'
}
</script>

<template>
  <div class="progress-page">
    <!-- Overview Card -->
    <div class="overview-card">
      <div class="overview-left">
        <h2>Progress Keseluruhan</h2>
        <p class="overview-subtitle">Tracking pengerjaan skripsimu</p>
        
        <div class="overview-stats">
          <div class="stat-item">
            <span class="stat-value">{{ progressStore.completedTasks }}</span>
            <span class="stat-label">Task Selesai</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">{{ progressStore.totalTasks }}</span>
            <span class="stat-label">Total Task</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value highlight">{{ progressStore.overallProgress }}%</span>
            <span class="stat-label">Progress</span>
          </div>
        </div>
      </div>
      
      <div class="overview-right">
        <div class="circular-progress">
          <svg viewBox="0 0 100 100">
            <circle class="progress-bg" cx="50" cy="50" r="40"/>
            <circle 
              class="progress-fill" 
              cx="50" 
              cy="50" 
              r="40"
              :style="{
                strokeDasharray: `${progressStore.overallProgress * 2.51} 251`,
                stroke: getProgressColor(progressStore.overallProgress)
              }"
            />
          </svg>
          <div class="progress-text">
            <span class="progress-number">{{ progressStore.overallProgress }}</span>
            <span class="progress-percent">%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chapters List -->
    <div class="chapters-section">
      <h3 class="section-title">Detail Per BAB</h3>
      
      <div class="chapters-list">
        <div 
          v-for="chapter in progressStore.chapters" 
          :key="chapter.id"
          class="chapter-card"
          :class="{ expanded: expandedChapter === chapter.id }"
        >
          <!-- Chapter Header -->
          <div class="chapter-header" @click="toggleChapter(chapter.id)">
            <div class="chapter-info">
              <h4 class="chapter-name">{{ chapter.name }}</h4>
              <span class="chapter-progress-text">
                {{ chapter.tasks.filter(t => t.completed).length }} / {{ chapter.tasks.length }} task
              </span>
            </div>
            
            <div class="chapter-right">
              <div class="mini-progress-bar">
                <div 
                  class="mini-progress-fill" 
                  :style="{ 
                    width: progressStore.getChapterProgress(chapter.id) + '%',
                    backgroundColor: getProgressColor(progressStore.getChapterProgress(chapter.id))
                  }"
                ></div>
              </div>
              <span class="chapter-percentage">{{ progressStore.getChapterProgress(chapter.id) }}%</span>
              <span class="expand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="expandedChapter === chapter.id ? '18 15 12 9 6 15' : '6 9 12 15 18 9'"/>
                </svg>
              </span>
            </div>
          </div>
          
          <!-- Chapter Tasks (Expanded) -->
          <div class="chapter-tasks" v-show="expandedChapter === chapter.id">
            <div 
              v-for="task in chapter.tasks" 
              :key="task.id"
              class="task-item"
              :class="{ completed: task.completed }"
            >
              <label class="task-checkbox">
                <input 
                  type="checkbox" 
                  :checked="task.completed"
                  @change="handleToggleTask(chapter.id, task.id)"
                />
                <span class="checkmark"></span>
              </label>
              <span class="task-name">{{ task.name }}</span>
              <button class="task-delete" @click="handleRemoveTask(chapter.id, task.id)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <!-- Add Task Form -->
            <div v-if="addingTaskTo === chapter.id" class="add-task-form">
              <input 
                v-model="newTaskName"
                type="text" 
                placeholder="Nama task baru..."
                @keyup.enter="submitAddTask(chapter.id)"
                @keyup.esc="cancelAddTask"
                autofocus
              />
              <button class="btn-save" @click="submitAddTask(chapter.id)">Simpan</button>
              <button class="btn-cancel" @click="cancelAddTask">Batal</button>
            </div>
            
            <button 
              v-else
              class="add-task-btn" 
              @click="startAddTask(chapter.id)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Tambah Task
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.progress-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Overview Card */
.overview-card {
  background: linear-gradient(135deg, #4F9CF9 0%, #3B82F6 100%);
  border-radius: var(--radius-xl);
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.overview-left h2 {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 4px;
}

.overview-subtitle {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 24px;
}

.overview-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
}

.stat-value.highlight {
  color: #FEF08A;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.3);
}

/* Circular Progress */
.circular-progress {
  position: relative;
  width: 140px;
  height: 140px;
}

.circular-progress svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.progress-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 8;
}

.progress-fill {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: baseline;
}

.progress-number {
  font-size: 36px;
  font-weight: 700;
}

.progress-percent {
  font-size: 16px;
  font-weight: 500;
}

/* Chapters Section */
.chapters-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.chapters-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chapter-card {
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.chapter-card.expanded {
  border-color: var(--primary-blue);
}

.chapter-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.chapter-header:hover {
  background-color: var(--bg-sidebar);
}

.chapter-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chapter-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.chapter-progress-text {
  font-size: 12px;
  color: var(--text-secondary);
}

.chapter-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mini-progress-bar {
  width: 120px;
  height: 8px;
  background-color: #E2E8F0;
  border-radius: 999px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.chapter-percentage {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  min-width: 40px;
  text-align: right;
}

.expand-icon {
  color: var(--text-secondary);
  display: flex;
  align-items: center;
}

/* Chapter Tasks */
.chapter-tasks {
  padding: 0 20px 20px 20px;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-sidebar);
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.task-item:last-of-type {
  border-bottom: none;
}

.task-item.completed .task-name {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.task-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.task-checkbox input:checked + .checkmark {
  background-color: var(--accent-green);
  border-color: var(--accent-green);
}

.task-checkbox input:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.task-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
}

.task-delete {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  opacity: 0;
  transition: all 0.2s ease;
}

.task-item:hover .task-delete {
  opacity: 1;
}

.task-delete:hover {
  color: #EF4444;
}

/* Add Task */
.add-task-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--primary-blue);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 12px 0;
  transition: opacity 0.2s ease;
}

.add-task-btn:hover {
  opacity: 0.8;
}

.add-task-form {
  display: flex;
  gap: 8px;
  padding: 12px 0;
}

.add-task-form input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 14px;
  outline: none;
}

.add-task-form input:focus {
  border-color: var(--primary-blue);
}

.btn-save {
  padding: 8px 16px;
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.btn-cancel {
  padding: 8px 16px;
  background-color: var(--bg-main);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
</style>
