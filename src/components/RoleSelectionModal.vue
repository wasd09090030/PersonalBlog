<template>  <div class="role-selection">
    <!-- 切换角色按钮 -->    <div class="d-flex align-items-center">
      <!-- 如果是管理员，添加退出按钮 -->
      <button
        v-if="isAdmin"
        class="btn btn-outline-light btn-sm me-2"
        @click="logout"
        title="退出管理员"
      >
        <i class="bi bi-box-arrow-right"></i>
      </button>
      
      <!-- 角色选择按钮 -->
      <button 
        class="btn btn-outline-light btn-sm d-flex align-items-center" 
        @click="openModal"
        :title="isAdmin ? '当前身份: 管理员' : '当前身份: 游客'"
      >
        <i class="bi" :class="isAdmin ? 'bi-person-fill-gear' : 'bi-person'"></i>
        <span class="ms-2 d-none d-md-inline">{{ isAdmin ? '管理员' : '游客' }}</span>
      </button>
    </div>
    
    <!-- 角色选择模态框 -->
    <div class="modal fade" id="roleSelectionModal" tabindex="-1" aria-labelledby="roleSelectionModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="roleSelectionModalLabel">选择用户身份</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="关闭"></button>
          </div>          <div class="modal-body">
            <div class="role-options">
              <div 
                class="role-option mb-3" 
                :class="{'active': currentRole === UserRoles.GUEST}"
                @click="selectRole(UserRoles.GUEST)"
              >
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-person fs-3 me-2"></i>
                  <h5 class="mb-0">游客</h5>
                </div>
                <p class="text-muted small mb-0">只能浏览文章，无法编辑或删除</p>
              </div>
              
              <div 
                class="role-option" 
                :class="{'active': currentRole === UserRoles.ADMIN}"
                @click="selectRole(UserRoles.ADMIN)"
              >
                <div class="d-flex align-items-center mb-2">
                  <i class="bi bi-person-fill-gear fs-3 me-2"></i>
                  <h5 class="mb-0">管理员</h5>
                </div>
                <p class="text-muted small mb-0">可以浏览、创建、编辑和删除文章</p>
              </div>
                <!-- 管理员密码输入 -->
              <div v-if="currentRole === UserRoles.ADMIN && !isAuthenticated" class="mt-3">
                <div class="alert alert-info" role="alert">
                  <i class="bi bi-info-circle-fill me-2"></i>
                  请输入管理员密码以验证身份
                </div>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-lock-fill"></i>
                  </span>
                  <input 
                    type="password" 
                    class="form-control" 
                    v-model="adminPassword" 
                    placeholder="请输入管理员密码"
                    :class="{'is-invalid': passwordError}"
                    @keyup.enter="confirmSelection"
                    ref="passwordInput"
                    autocomplete="off"
                  />
                </div>
                <div v-if="passwordError" class="invalid-feedback d-block">
                  {{ passwordError }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="confirmSelection" 
              data-bs-dismiss="modal"
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import auth, { UserRoles } from '../store/auth';
import { showToast } from './Toast.vue';

// 当前选中的角色(临时状态)
const currentRole = ref(auth.userRole.value);
const adminPassword = ref('');
const passwordError = ref('');
const passwordVerified = ref(false);
const passwordInput = ref(null); // 添加对密码输入框的引用

// 计算当前是否为管理员
const isAdmin = computed(() => auth.isAdmin());  // 计算是否已通过认证
const isAuthenticated = computed(() => auth.isAuthenticated.value);

// 选择角色
function selectRole(role) {
  currentRole.value = role;
  passwordError.value = '';
  
  // 如果已经通过认证，不需要重新输入密码
  if (role === UserRoles.ADMIN && !isAuthenticated.value) {
    adminPassword.value = ''; // 清空密码输入框
    
    // 自动聚焦密码输入框
    setTimeout(() => {
      if (passwordInput.value) {
        passwordInput.value.focus();
      }
    }, 100);
  }
}

// 退出管理员身份
function logout() {
  auth.logout();
  showToast('您已退出管理员身份', 'info', 3000);
}

// 确认选择并更新用户角色
function confirmSelection() {
  const previousRole = auth.userRole.value;
  
  // 如果选择管理员角色且需要认证
  if (currentRole.value === UserRoles.ADMIN && !isAuthenticated.value) {
    if (!adminPassword.value.trim()) {
      passwordError.value = '请输入管理员密码';
      return;
    }
    
    // 尝试验证密码
    const result = auth.setUserRole(currentRole.value, adminPassword.value);
    if (!result.success) {
      passwordError.value = result.message || '管理员密码错误';
      return;
    }
  } else {
    // 游客角色或已认证的管理员切换
    const result = auth.setUserRole(currentRole.value);
    if (!result.success) {
      showToast(result.message || '角色切换失败', 'danger', 5000);
      return;
    }
  }
  
  // 根据角色变化显示不同的提示信息
  setTimeout(() => {
    if (currentRole.value === UserRoles.ADMIN && previousRole !== UserRoles.ADMIN) {
      showToast('您已切换为管理员身份，可以进行文章的创建、编辑和删除操作。', 'success', 5000);
    } else if (currentRole.value === UserRoles.GUEST && previousRole !== UserRoles.GUEST) {
      showToast('您已切换为游客身份，仅可浏览文章内容。', 'info', 5000);
    }
  }, 300);
}

// 打开模态框
function openModal() {
  // 确保当前角色反映最新状态
  currentRole.value = auth.userRole.value;
  
  // 使用 Bootstrap 的 Modal API 打开模态框
  const modalElement = document.getElementById('roleSelectionModal');
  if (modalElement) {
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
}

// 组件挂载时初始化用户角色和模态框
onMounted(() => {
  auth.initUserRole();
  currentRole.value = auth.userRole.value;
  
  // 动态导入 Bootstrap 的 Modal 组件
  import('bootstrap').then(bootstrap => {
    window.bootstrap = bootstrap;
  });
});
</script>

<style scoped>
.role-option {
  padding: 15px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.role-option:hover {
  background-color: #f8f9fa;
}

.role-option.active {
  border-color: #0d6efd;
  background-color: #e7f1ff;
}

.role-option h5 {
  margin: 0;
}
</style>