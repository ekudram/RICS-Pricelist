// assets/js/rics-store.js
class RICSStore {
    constructor() {
        this.data = {
            items: [],
            events: [],
            traits: [],
            races: []
        };
        this.filteredData = {
            items: [],
            events: [],
            traits: [],
            races: []
        };
        this.currentSort = {};
        this.init();
    }

    async init() {
        await this.loadAllData();
        this.renderAllTabs();
        this.setupEventListeners();
    }

    async loadAllData() {
        try {
            // Load items
            const itemsResponse = await fetch('data/StoreItems.json');
            const itemsData = await itemsResponse.json();

            if (itemsData.items) {
                this.data.items = this.processItemsData(itemsData.items);
            } else {
                this.data.items = this.processItemsData(itemsData);
            }
            this.filteredData.items = [...this.data.items];

            // Load traits
            const traitsResponse = await fetch('data/Traits.json');
            const traitsData = await traitsResponse.json();
            this.data.traits = this.processTraitsData(traitsData);
            this.filteredData.traits = [...this.data.traits];

            // Load races
            const racesResponse = await fetch('data/RaceSettings.json');
            const racesData = await racesResponse.json();
            this.data.races = this.processRacesData(racesData);
            this.filteredData.races = [...this.data.races];

            // Load events
            const eventsResponse = await fetch('data/Incidents.json');
            const eventsData = await eventsResponse.json();
            this.data.events = this.processEventsData(eventsData);
            this.filteredData.events = [...this.data.events];

            // Load weather
            const weatherResponse = await fetch('data/Weather.json');
            const weatherData = await weatherResponse.json();
            this.data.weather = this.processWeatherData(weatherData);
            this.filteredData.weather = [...this.data.weather];

            console.log('Data loaded:', {
                items: this.data.items.length,
                traits: this.data.traits.length,
                races: this.data.races.length,
                events: this.data.events.length,
                weather: this.data.weather.length
            });

        } catch (error) {
            console.error('Error loading data:', error);
            this.loadSampleData();
        }
    }

    convertRimWorldColors(text) {
        if (!text || typeof text !== 'string') return text;

        // Convert RimWorld Unity rich text to HTML
        // Handle <color=#xxxxxx>text</color>
        // Also handle other Unity rich text tags
        let result = text;

        // Convert color tags to span with style
        result = result.replace(/<color=#([0-9a-fA-F]{6,8})>(.*?)<\/color>/gi,
            '<span style="color: #$1">$2</span>');

        // Convert other Unity rich text tags to HTML if needed
        result = result.replace(/<b>(.*?)<\/b>/gi, '<strong>$1</strong>');
        result = result.replace(/<i>(.*?)<\/i>/gi, '<em>$1</em>');

        return result;
    }

    processItemsData(itemsObject) {
        return Object.entries(itemsObject)
            .map(([key, itemData]) => {
                // Use the structure from your sample
                return {
                    defName: itemData.DefName || key,
                    name: itemData.CustomName || itemData.DefName || key,
                    price: itemData.BasePrice || 0,
                    category: itemData.Category || 'Misc',
                    quantityLimit: itemData.HasQuantityLimit ? (itemData.QuantityLimit || 0) : 'Unlimited',
                    limitMode: itemData.LimitMode,
                    mod: itemData.Mod || 'Unknown',
                    isUsable: itemData.IsUsable || false,
                    isEquippable: itemData.IsEquippable || false,
                    isWearable: itemData.IsWearable || false,
                    enabled: itemData.Enabled !== false
                };
            })
            .filter(item => {
                // Only include if enabled AND at least one usage type is true
                return (item.enabled || item.isUsable || item.isEquippable || item.isWearable);
            })
            .filter(item => item.price > 0); // Only items with price > 0
    }

    processEventsData(eventsObject) {
        return Object.entries(eventsObject)
            .map(([key, eventData]) => {
                return {
                    defName: eventData.DefName || key,
                    label: eventData.Label || eventData.DefName || key,
                    baseCost: eventData.BaseCost || 0,
                    karmaType: eventData.KarmaType || 'None',
                    modSource: eventData.ModSource || 'Unknown',
                    enabled: eventData.Enabled !== false
                };
            })
            .filter(event => event.enabled && event.baseCost > 0);
    }


    processTraitsData(traitsObject) {
        return Object.entries(traitsObject)
            .map(([key, traitData]) => {
                return {
                    defName: traitData.DefName || key,
                    name: traitData.Name || traitData.DefName || key,
                    description: this.processTraitDescription(traitData.Description || ''),
                    stats: traitData.Stats || [],
                    conflicts: traitData.Conflicts || [],
                    canAdd: traitData.CanAdd || false,
                    canRemove: traitData.CanRemove || false,
                    addPrice: traitData.AddPrice || 0,
                    removePrice: traitData.RemovePrice || 0,
                    bypassLimit: traitData.BypassLimit || false,
                    modSource: traitData.ModSource || 'Unknown'
                };
            })
            .filter(trait => {
                // Only include if at least one operation is allowed
                return trait.canAdd || trait.canRemove;
            })
            .filter(trait => trait.addPrice > 0 || trait.removePrice > 0); // Only traits with prices
    }

    processWeatherData(weatherObject) {
        return Object.entries(weatherObject)
            .map(([key, weatherData]) => {
                return {
                    defName: weatherData.DefName || key,
                    label: weatherData.Label || weatherData.DefName || key,
                    description: weatherData.Description || '',
                    baseCost: weatherData.BaseCost || 0,
                    karmaType: weatherData.KarmaType || 'None',
                    modSource: weatherData.ModSource || 'Unknown',
                    enabled: weatherData.Enabled !== false
                };
            })
            .filter(weather => weather.enabled && weather.baseCost > 0);
    }

    processTraitDescription(description) {
        // Replace all common pawn placeholders with traditional names
        // Handle both {} and [] formats with separate replacements
        return description
            // Replace {PAWN_*} formats
            .replace(/{PAWN_nameDef}/g, 'Timmy')
            .replace(/{PAWN_name}/g, 'Timmy')
            .replace(/{PAWN_pronoun}/g, 'he')
            .replace(/{PAWN_possessive}/g, 'his')
            .replace(/{PAWN_objective}/g, 'him')
            .replace(/{PAWN_label}/g, 'Timmy')
            .replace(/{PAWN_def}/g, 'Timmy')
            // Replace [PAWN_*] formats  
            .replace(/\[PAWN_nameDef\]/g, 'Timmy')
            .replace(/\[PAWN_name\]/g, 'Timmy')
            .replace(/\[PAWN_pronoun\]/g, 'he')
            .replace(/\[PAWN_possessive\]/g, 'his')
            .replace(/\[PAWN_objective\]/g, 'him')
            .replace(/\[PAWN_label\]/g, 'Timmy')
            .replace(/\[PAWN_def\]/g, 'Timmy');
    }

processRacesData(racesObject) {
    return Object.entries(racesObject)
        .map(([raceKey, raceData]) => {
            const baseRace = {
                defName: raceKey,
                name: raceData.DisplayName || raceKey,
                basePrice: raceData.BasePrice || 0,
                minAge: raceData.MinAge || 0,
                maxAge: raceData.MaxAge || 0,
                allowCustomXenotypes: raceData.AllowCustomXenotypes || false,
                defaultXenotype: raceData.DefaultXenotype || 'None',
                enabled: raceData.Enabled !== false,
                allowedGenders: raceData.AllowedGenders || {},
                xenotypePrices: raceData.XenotypePrices || {},
                enabledXenotypes: raceData.EnabledXenotypes || {}
            };

            // Create entries for each enabled xenotype
            const xenotypeEntries = [];
            if (baseRace.enabledXenotypes) {
                Object.entries(baseRace.enabledXenotypes).forEach(([xenotype, isEnabled]) => {
                    if (isEnabled && baseRace.xenotypePrices[xenotype]) {
                        const xenotypePrice = baseRace.xenotypePrices[xenotype]; // Direct price
                        xenotypeEntries.push({
                            defName: `${raceKey}_${xenotype}`,
                            name: `${baseRace.name} ${xenotype}`,
                            basePrice: xenotypePrice, // Use direct price
                            isXenotype: true,
                            parentRace: baseRace.name,
                            xenotype: xenotype,
                            xenotypePrice: xenotypePrice, // Store for reference
                            minAge: baseRace.minAge,
                            maxAge: baseRace.maxAge,
                            enabled: true,
                            allowedGenders: baseRace.allowedGenders
                        });
                    }
                });
            }

            // Return both the base race and its xenotypes
            const baseRaceEntry = {
                defName: raceKey,
                name: baseRace.name,
                basePrice: baseRace.basePrice,
                isXenotype: false,
                minAge: baseRace.minAge,
                maxAge: baseRace.maxAge,
                allowCustomXenotypes: baseRace.allowCustomXenotypes,
                defaultXenotype: baseRace.defaultXenotype,
                enabled: baseRace.enabled,
                xenotypeCount: xenotypeEntries.length,
                allowedGenders: baseRace.allowedGenders
            };

            return [baseRaceEntry, ...xenotypeEntries];
        })
        .flat() // Flatten the array of arrays
        .filter(race => race.enabled && race.basePrice > 0);
}

    renderAllTabs() {
        this.renderItems();
        this.renderEvents();
        this.renderWeather();
        this.renderTraits();
        this.renderRaces();
    }

    renderItems() {
        const tbody = document.getElementById('items-tbody');
        const items = this.filteredData.items;

        if (items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No items found</td></tr>';
            return;
        }

        tbody.innerHTML = items.map(item => `
            <tr>
                <td>
                    <div class="item-name">${this.escapeHtml(item.name)}</div>
                    <span class="metadata">
                        ${this.escapeHtml(item.defName)}
                        <br>From ${this.escapeHtml(item.mod)}
                        ${this.getUsageTypes(item)}
                    </span>
                </td>
                <td class="no-wrap">
                    <strong>${item.price}</strong>
                    <span class="mobile-priority primary"></span>
                </td>
                <td>${this.escapeHtml(item.category)}</td>
                <td class="no-wrap">${item.quantityLimit}</td>
                <td>${item.limitMode || 'N/A'}</td>
            </tr>
        `).join('');
    }

    getUsageTypes(item) {
        const types = [];
        if (item.isUsable) types.push('Usable');
        if (item.isEquippable) types.push('Equippable');
        if (item.isWearable) types.push('Wearable');

        return types.length > 0 ? `<br><span class="usage">Usage: ${types.join(', ')}</span>` : '';
    }

    renderEvents() {
        const tbody = document.getElementById('events-tbody');
        const events = this.filteredData.events;

        if (events.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px;">No events found</td></tr>';
            return;
        }

        tbody.innerHTML = events.map(event => {
            // Convert event label colors
            const coloredLabel = this.convertRimWorldColors(event.label);

            return `
        <tr>
            <td>
                <div class="item-name">${coloredLabel}</div>
                <span class="metadata">
                    ${this.escapeHtml(event.defName)}
                    <br>From ${this.escapeHtml(event.modSource)}
                    <br>Usage: !event ${this.escapeHtml(event.label)} or !event ${this.escapeHtml(event.defName)}
                </span>
            </td>
            <td class="no-wrap">
                <strong>${event.baseCost}</strong>
            </td>
            <td>${this.escapeHtml(event.karmaType)}</td>
        </tr>
    `}).join('');
    }

    renderTraits() {
        const tbody = document.getElementById('traits-tbody');
        const traits = this.filteredData.traits;

        if (traits.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px;">No traits found</td></tr>';
            return;
        }

        tbody.innerHTML = traits.map(trait => {
            // Convert trait name colors to HTML
            const coloredName = this.convertRimWorldColors(trait.name);

            return `
            <tr>
                <td>
                    <div class="item-name">${coloredName}</div>
                    <span class="metadata">
                        ${this.escapeHtml(trait.defName)}
                        <br>From ${this.escapeHtml(trait.modSource)}
                        ${trait.bypassLimit ? '<br><span class="usage">Bypasses Limit</span>' : ''}
                    </span>
                </td>
                <td class="no-wrap">
                    ${trait.canAdd ? `<strong>${trait.addPrice}</strong>` : '<span class="metadata">Cannot Add</span>'}
                </td>
                <td class="no-wrap">
                    ${trait.canRemove ? `<strong>${trait.removePrice}</strong>` : '<span class="metadata">Cannot Remove</span>'}
                </td>
                <td>
                    <div class="trait-description">${this.convertRimWorldColors(trait.description)}</div>
                    ${this.renderTraitStats(trait)}
                    ${this.renderTraitConflicts(trait)}
                </td>
            </tr>
        `;
        }).join('');
    }

    renderTraitStats(trait) {
        if (!trait.stats || trait.stats.length === 0) return '';

        const statsHtml = trait.stats.map(stat => {
            // Convert colors in stats too
            const coloredStat = this.convertRimWorldColors(stat);
            return `<li>${coloredStat}</li>`;
        }).join('');

        return `
        <div class="metadata">
            <strong>Stats:</strong>
            <ul style="margin: 5px 0; padding-left: 20px;">
                ${statsHtml}
            </ul>
        </div>
    `;
    }

    renderTraitConflicts(trait) {
        if (!trait.conflicts || trait.conflicts.length === 0) return '';

        const conflictsHtml = trait.conflicts.map(conflict => {
            // Convert colors in conflicts
            const coloredConflict = this.convertRimWorldColors(conflict);
            return `<li>${coloredConflict}</li>`;
        }).join('');

        return `
        <div class="metadata">
            <strong>Conflicts with:</strong>
            <ul style="margin: 5px 0; padding-left: 20px;">
                ${conflictsHtml}
            </ul>
        </div>
    `;
    }

    renderRaces() {
        const tbody = document.getElementById('races-tbody');
        const races = this.filteredData.races;
    
        if (races.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px;">No races found</td></tr>';
            return;
        }
    
        tbody.innerHTML = races.map(race => `
        <tr>
            <td>
                <div class="item-name">${this.escapeHtml(race.name)}</div>
                <span class="metadata">
                    ${race.isXenotype ? `Xenotype of ${this.escapeHtml(race.parentRace)}` : 'Base Race'}
                    ${!race.isXenotype && race.xenotypeCount > 0 ? `<br>${race.xenotypeCount} xenotypes available` : ''}
                    ${race.allowCustomXenotypes ? '<br>Custom xenotypes allowed' : ''}
                </span>
            </td>
            <td class="no-wrap">
                <strong>${race.basePrice}</strong>
                ${race.isXenotype ? `<span class="metadata">Direct price</span>` : ''}
            </td>
            <td class="no-wrap">
                Age: ${race.minAge}-${race.maxAge}
            </td>
            <td class="no-wrap">
                ${this.getAvailableGenders(race.allowedGenders)}
            </td>
        </tr>
    `).join('');
    }

    renderWeather() {
        const tbody = document.getElementById('weather-tbody');
        const weather = this.filteredData.weather;

        if (weather.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px;">No weather found</td></tr>';
            return;
        }

        tbody.innerHTML = weather.map(weatherItem => {
            // Convert weather label colors
            const coloredLabel = this.convertRimWorldColors(weatherItem.label);

            return `
        <tr>
            <td>
                <div class="item-name">${coloredLabel}</div>
                <span class="metadata">
                    ${this.escapeHtml(weatherItem.defName)}
                    <br>From ${this.escapeHtml(weatherItem.modSource)}
                    <br>Usage: !weather ${this.escapeHtml(weatherItem.label)} or !weather ${this.escapeHtml(weatherItem.defName)}
                </span>
            </td>
            <td class="no-wrap">
                <strong>${weatherItem.baseCost}</strong>
            </td>
            <td>${this.escapeHtml(weatherItem.karmaType)}</td>
            <td>
                ${weatherItem.description ?
                    `<div class="trait-description">${this.convertRimWorldColors(weatherItem.description)}</div>` :
                    'No description'}
            </td>
        </tr>
    `}).join('');
    }

    // Helper method to format available genders
    getAvailableGenders(allowedGenders) {
        const genders = [];
        if (allowedGenders.AllowMale) genders.push('M');
        if (allowedGenders.AllowFemale) genders.push('F');
        if (allowedGenders.AllowOther) genders.push('O');

        return genders.join(' ');
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                this.switchTab(button.dataset.tab);
            });
        });

        // Search functionality for each tab
        this.setupSearch('items');
        this.setupSearch('events');
        this.setupSearch('weather');
        this.setupSearch('traits');
        this.setupSearch('races');

        // Sort functionality
        this.setupSorting();
    }

    setupSearch(tabName) {
        const searchInput = document.getElementById(`${tabName}-search`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTab(tabName, e.target.value);
            });
        }
    }

    filterTab(tabName, searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        const allData = this.data[tabName];

        if (term === '') {
            this.filteredData[tabName] = [...allData];
        } else {
            this.filteredData[tabName] = allData.filter(item =>
                Object.values(item).some(value =>
                    value && value.toString().toLowerCase().includes(term)
                )
            );
        }

        this[`render${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`]();
    }

    setupSorting() {
        // Add sorting to all sortable headers
        document.querySelectorAll('th[data-sort]').forEach(header => {
            header.addEventListener('click', () => {
                const tab = header.closest('.tab-pane').id;
                this.sortTab(tab, header.dataset.sort);
            });
        });
    }

    sortTab(tabName, field) {
        if (!this.currentSort[tabName]) {
            this.currentSort[tabName] = { field, direction: 'asc' };
        } else if (this.currentSort[tabName].field === field) {
            this.currentSort[tabName].direction = this.currentSort[tabName].direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort[tabName] = { field, direction: 'asc' };
        }

        this.filteredData[tabName].sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];

            // Handle "Unlimited" quantity limit for sorting
            if (field === 'quantityLimit') {
                aValue = aValue === 'Unlimited' ? Infinity : aValue;
                bValue = bValue === 'Unlimited' ? Infinity : bValue;
            }

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return this.currentSort[tabName].direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.currentSort[tabName].direction === 'asc' ? 1 : -1;
            return 0;
        });

        this[`render${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`]();
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe;

        // First convert RimWorld color tags to HTML
        unsafe = this.convertRimWorldColors(unsafe);

        // Then escape any remaining HTML that isn't from our color conversion
        // But don't escape the spans we just created
        const tempDiv = document.createElement('div');
        tempDiv.textContent = unsafe;

        // Get the HTML back, which will have proper escaping for text content
        // but preserve the span tags we inserted
        return tempDiv.innerHTML;
    }

    loadSampleData() {
        // Fallback sample data
        console.log('Loading sample data...');
        this.data.items = [
            {
                defName: "TextBook",
                name: "Textbook",
                price: 267,
                category: "Books",
                quantityLimit: 5,
                limitMode: "OneStack",
                mod: "Core",
                isUsable: false,
                isEquippable: false,
                isWearable: false,
                enabled: true
            },
            {
                defName: "Schematic",
                name: "Schematic",
                price: 250,
                category: "Books",
                quantityLimit: 5,
                limitMode: "OneStack",
                mod: "Core",
                isUsable: false,
                isEquippable: false,
                isWearable: false,
                enabled: true
            }
        ];
        this.filteredData.items = [...this.data.items];
        this.renderItems();
    }

}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new RICSStore();
});
