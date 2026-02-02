import React, { useState } from 'react';

interface Store {
  id: string;
  name: string;
  code: string;
  companyId: string;
  companyName: string;
  areaId: string;
  areaName: string;
  managerId: string;
  managerName: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

interface StoreDetailProps {
  stores: Store[];
  companyName: string;
  onBack: () => void;
}

const StoreDetail: React.FC<StoreDetailProps> = ({ stores, companyName, onBack }) => {
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [storeList, setStoreList] = useState(stores);

  const handleAddStore = () => {
    setModalMode('add');
    setSelectedStore(null);
    setShowStoreModal(true);
  };

  const handleEditStore = (store: any) => {
    console.log('編輯專櫃函數被調用:', store);
    console.log('當前模態框狀態:', showStoreModal);
    console.log('當前選中的專櫃:', selectedStore);
    
    // 強制更新狀態
    setModalMode('edit');
    setSelectedStore(store);
    
    // 使用 setTimeout 確保狀態更新完成後再顯示模態框
    setTimeout(() => {
      setShowStoreModal(true);
      console.log('設置模態框為顯示狀態');
    }, 100);
  };

  const handleSaveStore = (store: any) => {
    console.log('保存專櫃:', store);
    
    if (modalMode === 'add') {
      // 新增專櫃
      const newStore = {
        ...store,
        id: `store-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setStoreList(prev => [...prev, newStore]);
      alert('新增專櫃成功！');
    } else {
      // 更新專櫃
      setStoreList(prev => prev.map(s => s.id === store.id ? { ...store, updatedAt: new Date().toISOString() } : s));
      alert('更新專櫃成功！');
    }
    
    setShowStoreModal(false);
    setSelectedStore(null);
  };

  const handleDeleteStore = (storeId: string) => {
    if (confirm('確定要刪除這個專櫃嗎？')) {
      setStoreList(prev => prev.filter(s => s.id !== storeId));
      alert('刪除專櫃成功！');
    }
  };

  const handleCloseModal = () => {
    setShowStoreModal(false);
    setSelectedStore(null);
  };
  return (
    <div className="space-y-6">
      {/* 標題區域 */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
          >
            ← 返回公司詳情
          </button>
          <h3 className="text-lg font-medium text-gray-900">{companyName} - 專櫃管理</h3>
          <p className="text-sm text-gray-500">管理該公司下的所有專櫃</p>
        </div>
        <button 
          onClick={handleAddStore}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          ➕ 新增專櫃
        </button>
      </div>

      {/* 專櫃統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{storeList.length}</div>
          <div className="text-sm text-blue-800">總專櫃數</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {storeList.filter(s => s.status === 'active').length}
          </div>
          <div className="text-sm text-green-800">營運中</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">
            {storeList.reduce((sum, s) => sum + s.employeeCount, 0)}
          </div>
          <div className="text-sm text-orange-800">總員工數</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round((storeList.filter(s => s.status === 'active').length / storeList.length) * 100)}%
          </div>
          <div className="text-sm text-purple-800">營運率</div>
        </div>
      </div>

      {/* 專櫃列表 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">專櫃列表</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  專櫃名稱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  專櫃代碼
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  地區
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  櫃長
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  員工數
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {storeList.map((store) => (
                <tr key={store.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{store.name}</div>
                    <div className="text-sm text-gray-500">{store.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.areaName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.managerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {store.employeeCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      store.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {store.status === 'active' ? '營運中' : '停用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('編輯專櫃按鈕被點擊:', store);
                        handleEditStore(store);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      編輯
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('查看專櫃按鈕被點擊:', store);
                      }}
                      className="text-gray-600 hover:text-gray-900 mr-3"
                    >
                      查看
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('刪除專櫃按鈕被點擊:', store.id);
                        handleDeleteStore(store.id);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 專櫃分佈 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">地區分佈</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from(new Set(storeList.map(s => s.areaName))).map(areaName => {
            const areaStores = storeList.filter(s => s.areaName === areaName);
            return (
              <div key={areaName} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className="font-medium text-gray-900">{areaName}</h5>
                    <p className="text-sm text-gray-500">{areaStores.length} 個專櫃</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{areaStores.length}</div>
                    <div className="text-xs text-blue-800">專櫃數</div>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {areaStores.map(store => (
                    <div key={store.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{store.name}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        store.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {store.status === 'active' ? '營運中' : '停用'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 專櫃表單模態框 - 簡化版本 */}
      {showStoreModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999
          }}
          onClick={handleCloseModal}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '20px' }}>
              {modalMode === 'add' ? '新增專櫃' : '編輯專櫃'}
            </h2>
            
            {/* 簡化的表單 */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>專櫃名稱:</label>
              <input
                type="text"
                value={selectedStore?.name || ''}
                onChange={(e) => setSelectedStore((prev: any) => prev ? {...prev, name: e.target.value} : null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>專櫃代碼:</label>
              <input
                type="text"
                value={selectedStore?.code || ''}
                onChange={(e) => setSelectedStore((prev: any) => prev ? {...prev, code: e.target.value} : null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>櫃長姓名:</label>
              <input
                type="text"
                value={selectedStore?.managerName || ''}
                onChange={(e) => setSelectedStore((prev: any) => prev ? {...prev, managerName: e.target.value} : null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>電話:</label>
              <input
                type="text"
                value={selectedStore?.phone || ''}
                onChange={(e) => setSelectedStore((prev: any) => prev ? {...prev, phone: e.target.value} : null)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (selectedStore) {
                    handleSaveStore(selectedStore);
                  }
                }}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {modalMode === 'add' ? '新增' : '更新'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 調試信息 */}
      <div style={{ 
        position: 'fixed', 
        bottom: 10, 
        right: 10, 
        background: 'black', 
        color: 'white', 
        padding: '10px', 
        fontSize: '12px', 
        zIndex: 100000,
        borderRadius: '4px',
        maxWidth: '300px'
      }}>
        <div>模態框狀態: {showStoreModal.toString()}</div>
        <div>模式: {modalMode}</div>
        <div>選中專櫃: {selectedStore ? selectedStore.name : '無'}</div>
        <div>專櫃ID: {selectedStore ? selectedStore.id : '無'}</div>
        <div>公司ID: {selectedStore ? selectedStore.companyId : '無'}</div>
      </div>
    </div>
  );
};

export default StoreDetail;
