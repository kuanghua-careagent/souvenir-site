// ═══════════════════════════════════════════════
// 全站會員權限控制 auth.js
// 未登入：隱藏會員功能欄位，只能看查詢/登入/註冊
// 已登入：開放全部功能
// 受保護頁面：未登入直接跳轉登入頁
// ═══════════════════════════════════════════════
const SESSION_KEY = 'souvenir_session';
const USERS_KEY = 'souvenir_users';

function getSessionUser() {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    return users.find(u => u.email === email) || null;
  } catch(e) { return null; }
}

/** 套用導覽權限（隱藏/顯示會員功能） */
function applyAuthNav() {
  const user = getSessionUser();
  const memberLinks = document.querySelectorAll('.nav-member');
  const guestLinks = document.querySelectorAll('.nav-guest');
  const navUser = document.getElementById('navUser');
  const navLogin = document.getElementById('navLogin');

  if (!user) {
    memberLinks.forEach(a => a.style.display = 'none');
    if (navLogin) { navLogin.textContent = '🔐 登入'; navLogin.href = 'login.html'; }
    if (navUser) navUser.style.display = 'none';
    return false;
  }
  memberLinks.forEach(a => a.style.display = '');
  guestLinks.forEach(a => a.style.display = 'none');
  if (navUser) {
    navUser.style.display = 'inline-block';
    navUser.textContent = `👤 ${user.name}（${user.certCode || ''}）`;
  }
  if (navLogin) {
    navLogin.textContent = '🚪 登出';
    navLogin.href = 'javascript:logout()';
  }
  return true;
}

/** 受保護頁面檢查：未登入跳轉登入頁 */
function requireAuth() {
  const user = getSessionUser();
  if (!user) {
    alert('🔒 請先登入會員');
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
}

// ═══ 一鍵重置：開 ?reset=1 清除所有本機資料 ═══
function handleReset() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('reset') === '1') {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(USERS_KEY);
    alert('✅ 所有資料已清除，請重新註冊');
    // 清除網址參數，避免重整又觸發
    window.location.href = window.location.pathname;
  }
}

// 頁面載入時自動套用導覽權限
document.addEventListener('DOMContentLoaded', () => {
  handleReset();
  applyAuthNav();
});
