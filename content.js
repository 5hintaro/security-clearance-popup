// アラートを一度だけ表示するためのフラグ
let alertShown = false;

// 現在の求人IDを保持する変数
let currentJobId = null;

// SC Clearance, SC Cleared, Security Clearance を検出する関数
function checkForSecurityClearance() {
    try {
        console.log('Checking for security clearance keywords...');
        const bodyText = document.body ? document.body.innerText : '';
        // "SC Clearance", "SC Cleared", "Security Clearance" のいずれかにマッチ
        const scRegex = /\b(SC\s*Clearance|SC\s*Cleared|Security\s*Clearance)\b/i;
        if (scRegex.test(bodyText)) {
            console.log('Security clearance keyword found.');
            if (!alertShown) {
                // アラートを表示
                alert('This job includes a security clearance requirement!');
                alertShown = true; // アラートを一度だけ表示
            }
        } else {
            console.log('Security clearance keywords not found.');
            // "SC Clearance" などが見つからない場合、フラグをリセットしない
            // これにより、ページ内の動的な変更でアラートが再度表示されることを防ぎます
        }
    } catch (error) {
        console.error('Error in checkForSecurityClearance:', error);
    }
}

// Indeedの求人詳細ページを識別する関数
function isIndeedJobDetailPage() {
    const url = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('vjk');
}

// ページの変化を処理する関数
function handlePageChange() {
    if (isIndeedJobDetailPage()) {
        const urlParams = new URLSearchParams(window.location.search);
        const jobId = urlParams.get('vjk');

        if (jobId !== currentJobId) {
            console.log('New job detail page detected.');
            currentJobId = jobId;
            alertShown = false; // 新しい求人ページに移動した際にフラグをリセット
            checkForSecurityClearance();
        } else {
            console.log('Same job detail page. No action taken.');
        }
    } else {
        console.log('Not a job detail page. No action taken.');
    }
}

// MutationObserverの初期化関数
function initializeObserver() {
    // History APIの変更をフックしてSPAのページ遷移を監視
    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        handlePageChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        handlePageChange();
    };

    // popstateイベント（ブラウザの戻る/進むボタン）を監視
    window.addEventListener('popstate', handlePageChange);

    // DOMの変化を監視
    const observer = new MutationObserver((mutations, obs) => {
        handlePageChange();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// ページの読み込みが完了した後に関数を実行
window.addEventListener('load', () => {
    handlePageChange();
    initializeObserver();
});
