/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #fff8f0 0%, #ffe8d6 100%);
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Header */
header {
    text-align: center;
    margin-bottom: 30px;
    padding: 25px;
    background: linear-gradient(135deg, #ff7e30 0%, #ff5722 100%);
    color: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(255, 87, 34, 0.3);
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

header p {
    font-size: 1.1rem;
    opacity: 0.95;
}

/* Tabs */
.tabs {
    display: flex;
    background: white;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow-x: auto;
}

.tab-button {
    padding: 15px 25px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;
    color: #666;
    white-space: nowrap;
}

.tab-button:hover {
    background: #fff5eb;
    color: #ff7e30;
}

.tab-button.active {
    background: white;
    border-bottom: 3px solid #ff7e30;
    color: #ff7e30;
    font-weight: 600;
}

/* Tab content */
.tab-content {
    background: white;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    min-height: 400px;
    border: 1px solid #ffe0cc;
    border-top: none;
}

.tab-pane {
    display: none;
    padding: 25px;
}

.tab-pane.active {
    display: block;
}

/* Search box */
.search-box {
    margin-bottom: 20px;
}

.search-input {
    width: 100%;
    padding: 14px;
    border: 2px solid #ffe0cc;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #fffaf5;
}

.search-input:focus {
    outline: none;
    border-color: #ff7e30;
    background: white;
    box-shadow: 0 0 0 3px rgba(255, 126, 48, 0.1);
}

/* Table styles */
.table-container {
    overflow-x: auto;
    border-radius: 8px;
}

.items-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background: white;
}

.items-table th {
    background: linear-gradient(135deg, #fff5eb 0%, #ffe8d6 100%);
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: #e65100;
    border-bottom: 2px solid #ff7e30;
    cursor: pointer;
    user-select: none;
    position: relative;
    font-size: 0.95rem;
}

.items-table th:hover {
    background: linear-gradient(135deg, #ffe8d6 0%, #ffd9b3 100%);
}

.items-table th::after {
    content: '↕';
    position: absolute;
    right: 12px;
    opacity: 0.5;
    color: #ff7e30;
}

.items-table th.sort-asc::after {
    content: '↑';
    opacity: 1;
}

.items-table th.sort-desc::after {
    content: '↓';
    opacity: 1;
}

.items-table td {
    padding: 16px;
    border-bottom: 1px solid #ffe0cc;
    vertical-align: top;
    transition: background-color 0.2s ease;
}

.items-table tbody tr:hover {
    background: #fffaf5;
}

.items-table tbody tr:last-child td {
    border-bottom: none;
}

/* Item name styles */
.item-name {
    font-weight: 600;
    font-size: 1.05rem;
    color: #e65100;
    margin-bottom: 4px;
}

/* Metadata styles */
.metadata {
    font-size: 0.85rem;
    color: #8d6e63;
    display: block;
    line-height: 1.4;
}

.metadata .usage {
    color: #ff7e30;
    font-weight: 500;
}

/* Price highlighting */
.items-table td:nth-child(2) {
    font-weight: 600;
    color: #e65100;
}

/* Race-specific styles */
.race-xenotype {
    background-color: #fffaf5;
}

.race-base {
    background-color: white;
    border-left: 3px solid #ff7e30;
}

/* Trait description styles */
.trait-description {
    margin-bottom: 8px;
    line-height: 1.5;
    color: #5d4037;
}

/* Mobile priority indicators */
.mobile-priority {
    display: none;
}

/* No wrap for important columns */
.items-table .no-wrap {
    white-space: nowrap;
}

/* Responsive design */
@media (max-width: 768px) {
    .container {
        padding: 15px;
    }
    
    header {
        padding: 20px;
        margin-bottom: 20px;
    }
    
    header h1 {
        font-size: 2rem;
    }
    
    .tab-button {
        padding: 12px 18px;
        font-size: 0.9rem;
    }
    
    .tab-pane {
        padding: 20px;
    }
    
    .search-input {
        padding: 12px;
    }
    
    .items-table th,
    .items-table td {
        padding: 12px 10px;
        font-size: 0.9rem;
    }
    
    .items-table {
        min-width: 600px;
    }
    
    /* Show priority indicators on mobile */
    .mobile-priority {
        display: inline-block;
        margin-left: 5px;
    }
    
    .mobile-priority.primary::after {
        content: "💰";
    }
}

@media (max-width: 480px) {
    .container {
        padding: 10px;
    }
    
    header h1 {
        font-size: 1.8rem;
    }
    
    header p {
        font-size: 1rem;
    }
    
    .tab-button {
        padding: 10px 15px;
        font-size: 0.85rem;
    }
    
    .items-table {
        min-width: 550px;
    }
}

/* Custom scrollbar for webkit browsers */
.table-container::-webkit-scrollbar {
    height: 8px;
}

.table-container::-webkit-scrollbar-track {
    background: #ffe0cc;
    border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
    background: #ff7e30;
    border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
    background: #e65100;
}
