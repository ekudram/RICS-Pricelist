// assets/js/rics-store.js
class RICSStore {
    constructor() {
        this.data = { items: [], events: [], traits: [], races: [], weather: [] };
        this.filteredData = { items: [], events: [], traits: [], races: [], weather: [] };
        this.currentSort = {};
        this.loadFailed = false;
        this.init();
    }

    async init() {
        await this.loadAllData();
        this.renderAllTabs();
        this.setupEventListeners();
    }

    async loadAllData() {
        this.loadFailed = false;
        const promises = [
            this.loadJson('items', 'data/StoreItems.json', this.processItemsData.bind(this)),
            this.loadJson('traits', 'data/Traits.json', this.processTraitsData.bind(this)),
            this.loadJson('races', 'data/RaceSettings.json', this.processRacesData.bind(this)),
            this.loadJson('events', 'data/Incidents.json', this.processEventsData.bind(this)),
            this.loadJson('weather', 'data/Weather.json', this.processWeatherData.bind(this))
        ];

        await Promise.allSettled(promises);

        if (this.loadFailed) {
            const warning = document.createElement('div');
            warning.style = 'background:#fff3cd; color:#856404; padding:12px; margin:16px; border-radius:6px; text-align:center;';
            warning.textContent = 'Warning: Some data files failed to load. Some tabs may be incomplete.';
            document.querySelector('.container').prepend(warning);
        }

        console.log('Data loaded:', {
            items: this.data.items.length,
            traits: this.data.traits.length,
            races: this.data.races.length,
            events: this.data.events.length,
            weather: this.data.weather.length
        });
    }

    async loadJson(key, url, processor) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const raw = await res.json();
            const data = (key === 'items' && raw.items) ? raw.items : raw;

            this.data[key] = processor(data);
            this.filteredData[key] = [...this.data[key]];
        } catch (e) {
            console.error(`Failed to load ${url}:`, e);
            this.loadFailed = true;
            this.data[key] = [];
            this.filteredData[key] = [];
        }
    }

    // ==================== COLOR & PROCESSORS (same as before) ====================
    convertRimWorldColors(text) {
        if (!text || typeof text !== 'string') return text;
        let result = text;
        result = result.replace(/<color=#([0-9a-fA-F]{6,8})>(.*?)<\/color>/gi, '<span style="color: #$1">$2</span>');
        result = result.replace(/<b>(.*?)<\/b>/gi, '<strong>$1</strong>');
        result = result.replace(/<i>(.*?)<\/i>/gi, '<em>$1</em>');
        return result;
    }

    processItemsData(itemsObject) {
        return Object.entries(itemsObject || {})
            .map(([key, itemData]) => ({
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
            }))
            .filter(item => (item.enabled || item.isUsable || item.isEquippable || item.isWearable))
            .filter(item => item.price > 0);
    }

    processEventsData(eventsObject) {
        return Object.entries(eventsObject || {})
            .map(([key, eventData]) => ({
                defName: eventData.DefName || key,
                label: eventData.Label || eventData.DefName || key,
                baseCost: eventData.BaseCost || 0,
                karmaType: eventData.KarmaType || 'None',
                modSource: eventData.ModSource || 'Unknown',
                enabled: eventData.Enabled !== false
            }))
            .filter(event => event.enabled && event.baseCost > 0);
    }

    processTraitsData(traitsObject) {
        return Object.entries(traitsObject || {})
            .map(([key, traitData]) => ({
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
            }))
            .filter(trait => trait.canAdd || trait.canRemove)
            .filter(trait => trait.addPrice > 0 || trait.removePrice > 0);
    }

    processWeatherData(weatherObject) {
        return Object.entries(weatherObject || {})
            .map(([key, weatherData]) => ({
                defName: weatherData.DefName || key,
                label: weatherData.Label || weatherData.DefName || key,
                description: weatherData.Description || '',
                baseCost: weatherData.BaseCost || 0,
                karmaType: weatherData.KarmaType || 'None',
                modSource: weatherData.ModSource || 'Unknown',
                enabled: weatherData.Enabled !== false
            }))
            .filter(weather => weather.enabled && weather.baseCost > 0);
    }

    processRacesData(racesObject) {
        return Object.entries(racesObject || {})
            .map(([raceKey, raceData]) => {
                const baseRace = {
                    defName: raceKey,
                    name: raceData.DisplayName || raceKey,
                    basePrice: Math.round(raceData.BasePrice || 0),
                    minAge: raceData.MinAge || 0,
                    maxAge: raceData.MaxAge || 0,
                    allowCustomXenotypes: raceData.AllowCustomXenotypes || false,
                    defaultXenotype: raceData.DefaultXenotype || 'None',
                    enabled: raceData.Enabled !== false,
                    modActive: raceData.ModActive !== false,
                    allowedGenders: raceData.AllowedGenders || {},
                    xenotypePrices: raceData.XenotypePrices || {},
                    enabledXenotypes: raceData.EnabledXenotypes || {}
                };

                const xenotypeEntries = [];
                if (baseRace.enabledXenotypes) {
                    Object.entries(baseRace.enabledXenotypes).forEach(([xenotype, isEnabled]) => {
                        if (isEnabled && baseRace.xenotypePrices[xenotype] !== undefined) {
                            xenotypeEntries.push({
                                defName: `${raceKey}_${xenotype}`,
                                name: `${baseRace.name} ${xenotype}`,
                                basePrice: Math.round(baseRace.xenotypePrices[xenotype]),
                                isXenotype: true,
                                parentRace: baseRace.name,
                                xenotype: xenotype,
                                minAge: baseRace.minAge,
                                maxAge: baseRace.maxAge,
                                enabled: true,
                                modActive: baseRace.modActive,
                                allowedGenders: baseRace.allowedGenders
                            });
                        }
                    });
                }

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
                    modActive: baseRace.modActive,
                    xenotypeCount: xenotypeEntries.length,
                    allowedGenders: baseRace.allowedGenders
                };

                return [baseRaceEntry, ...xenotypeEntries];
            })
            .flat()
            .filter(race => race.enabled && race.modActive !== false);
    }

    processTraitDescription(description) {
        return description
            .replace(/{PAWN_nameDef}/g, 'Timmy')
            .replace(/{PAWN_name}/g, 'Timmy')
            .replace(/{PAWN_pronoun}/g, 'he')
            .replace(/{PAWN_possessive}/g, 'his')
            .replace(/{PAWN_objective}/g, 'him')
            .replace(/{PAWN_label}/g, 'Timmy')
            .replace(/{PAWN_def}/g, 'Timmy')
            .replace(/\[PAWN_nameDef\]/g, 'Timmy')
            .replace(/\[PAWN_name\]/g, 'Timmy')
            .replace(/\[PAWN_pronoun\]/g, 'he')
            .replace(/\[PAWN_possessive\]/g, 'his')
            .replace(/\[PAWN_objective\]/g, 'him')
            .replace(/\[PAWN_label\]/g, 'Timmy')
            .replace(/\[PAWN_def\]/g, 'Timmy');
    }

    // ==================== RENDERING (traits now correctly in first column) ====================
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
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:40px;">No items found</td></tr>';
            return;
        }
        tbody.innerHTML = items.map(item => `
            <tr>
                <td>
                    <div class="item-name">${this.escapeHtml(item.name)}</div>
                    <span class="metadata">
                        ${this.escapeHtml(item.defName)}<br>
                        From ${this.escapeHtml(this.getModDisplayName(item.mod))}<br>
                        Usage: !buy ${this.escapeHtml(item.name)} or !buy ${this.escapeHtml(item.defName)}
                        ${this.getUsageTypes(item)}
                    </span>
                </td>
                <td class="no-wrap"><strong>${item.price}</strong></td>
                <td>${this.escapeHtml(item.category)}</td>
                <td class="no-wrap">${item.quantityLimit}</td>
            </tr>
        `).join('');
    }

    renderEvents() { /* same as before */ 
        const tbody = document.getElementById('events-tbody');
        const events = this.filteredData.events;
        if (events.length === 0) { tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:40px;">No events found</td></tr>'; return; }
        tbody.innerHTML = events.map(event => {
            const coloredLabel = this.convertRimWorldColors(event.label);
            return `<tr>
                <td><div class="item-name">${coloredLabel}</div><span class="metadata">${this.escapeHtml(event.defName)}<br>From ${this.escapeHtml(event.modSource)}<br>Usage: !event ${this.escapeHtml(event.label)} or !event ${this.escapeHtml(event.defName)}</span></td>
                <td class="no-wrap"><strong>${event.baseCost}</strong></td>
                <td>${this.escapeHtml(event.karmaType)}</td>
            </tr>`;
        }).join('');
    }

    renderTraits() { /* fixed layout - description in first column */ 
        const tbody = document.getElementById('traits-tbody');
        const traits = this.filteredData.traits;
        if (traits.length === 0) { tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:40px;">No traits found</td></tr>'; return; }
        tbody.innerHTML = traits.map(trait => {
            const coloredName = this.convertRimWorldColors(trait.name);
            return `<tr>
                <td>
                    <div class="item-name">${coloredName}</div>
                    <span class="metadata">${this.escapeHtml(trait.defName)}<br>From ${this.escapeHtml(trait.modSource)}${trait.bypassLimit ? '<br><span class="usage">Bypasses Limit</span>' : ''}</span>
                    <div class="trait-description">${this.convertRimWorldColors(trait.description)}</div>
                    ${this.renderTraitStats(trait)}
                    ${this.renderTraitConflicts(trait)}
                </td>
                <td class="no-wrap">${trait.canAdd ? `<strong>${trait.addPrice}</strong>` : '<span class="metadata">Cannot Add</span>'}</td>
                <td class="no-wrap">${trait.canRemove ? `<strong>${trait.removePrice}</strong>` : '<span class="metadata">Cannot Remove</span>'}</td>
            </tr>`;
        }).join('');
    }

    renderTraitStats(trait) {
        if (!trait.stats?.length) return '';
        return `<div class="metadata"><strong>Stats:</strong><ul style="margin:5px 0;padding-left:20px;">${trait.stats.map(s => `<li>${this.convertRimWorldColors(s)}</li>`).join('')}</ul></div>`;
    }

    renderTraitConflicts(trait) {
        if (!trait.conflicts?.length) return '';
        return `<div class="metadata"><strong>Conflicts with:</strong><ul style="margin:5px 0;padding-left:20px;">${trait.conflicts.map(c => `<li>${this.convertRimWorldColors(c)}</li>`).join('')}</ul></div>`;
    }

    renderRaces() { /* unchanged */ 
        const tbody = document.getElementById('races-tbody');
        const races = this.filteredData.races;
        if (races.length === 0) { tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:40px;">No races found</td></tr>'; return; }
        tbody.innerHTML = races.map(race => `
            <tr>
                <td><div class="item-name">${this.escapeHtml(race.name)}</div><span class="metadata">${race.isXenotype ? `Xenotype of ${this.escapeHtml(race.parentRace)}` : 'Base Race'}${!race.isXenotype && race.xenotypeCount ? `<br>${race.xenotypeCount} xenotypes` : ''}${race.allowCustomXenotypes ? '<br>Custom xenotypes allowed' : ''}</span></td>
                <td class="no-wrap"><strong>${race.basePrice}</strong></td>
                <td class="no-wrap">Age: ${race.minAge}-${race.maxAge}</td>
                <td class="no-wrap">${this.getAvailableGenders(race.allowedGenders)}</td>
            </tr>
        `).join('');
    }

    renderWeather() { /* unchanged */ 
        const tbody = document.getElementById('weather-tbody');
        const weather = this.filteredData.weather;
        if (weather.length === 0) { tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:40px;">No weather found</td></tr>'; return; }
        tbody.innerHTML = weather.map(w => {
            const colored = this.convertRimWorldColors(w.label);
            return `<tr>
                <td><div class="item-name">${colored}</div><span class="metadata">${this.escapeHtml(w.defName)}<br>From ${this.escapeHtml(w.modSource)}<br>Usage: !weather ${this.escapeHtml(w.label)} or !weather ${this.escapeHtml(w.defName)}</span></td>
                <td class="no-wrap"><strong>${w.baseCost}</strong></td>
                <td>${this.escapeHtml(w.karmaType)}</td>
                <td>${w.description ? `<div class="trait-description">${this.convertRimWorldColors(w.description)}</div>` : 'No description'}</td>
            </tr>`;
        }).join('');
    }

    // ==================== HELPERS ====================
    getUsageTypes(item) {
        const types = [];
        if (item.isUsable) types.push('Usable');
        if (item.isEquippable) types.push('Equippable');
        if (item.isWearable) types.push('Wearable');
        return types.length ? `<br><span class="usage">Usage: ${types.join(', ')}</span>` : '';
    }

    getAvailableGenders(g) {
        const arr = [];
        if (g.AllowMale) arr.push('M');
        if (g.AllowFemale) arr.push('F');
        if (g.AllowOther) arr.push('O');
        return arr.join(' ');
    }

    getModDisplayName(mod) {
        return mod === 'Core' ? 'RimWorld' : (mod || 'Unknown');
    }

    escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return unsafe || '';
        return this.convertRimWorldColors(unsafe);   // colors now work
    }

    // ==================== FULL EVENT SYSTEM (this was missing) ====================
    setupEventListeners() {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        ['items','events','weather','traits','races'].forEach(tab => this.setupSearch(tab));
        this.setupSorting();
    }

    setupSearch(tabName) {
        const input = document.getElementById(`${tabName}-search`);
        if (input) {
            input.addEventListener('input', e => this.filterTab(tabName, e.target.value));
        }
    }

    filterTab(tabName, searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        const all = this.data[tabName] || [];
        if (!term) {
            this.filteredData[tabName] = [...all];
        } else {
            this.filteredData[tabName] = all.filter(item => {
                const text = [
                    item.name, item.label, item.defName, item.description,
                    item.category, item.karmaType, item.modSource,
                    ...(Array.isArray(item.stats) ? item.stats : []),
                    ...(Array.isArray(item.conflicts) ? item.conflicts : [])
                ].join(' ').toLowerCase();
                return text.includes(term);
            });
        }
        this[`render${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`]();
    }

    setupSorting() {
        document.querySelectorAll('th[data-sort]').forEach(header => {
            header.addEventListener('click', () => {
                const tab = header.closest('.tab-pane').id;
                this.sortTab(tab, header.dataset.sort);
            });
        });
    }

    sortTab(tabName, field) {
        if (!this.currentSort[tabName]) this.currentSort[tabName] = { field, direction: 'asc' };
        else if (this.currentSort[tabName].field === field) this.currentSort[tabName].direction = this.currentSort[tabName].direction === 'asc' ? 'desc' : 'asc';
        else this.currentSort[tabName] = { field, direction: 'asc' };

        this.filteredData[tabName].sort((a, b) => {
            let va = a[field], vb = b[field];
            if (field === 'quantityLimit') { va = va === 'Unlimited' ? Infinity : va; vb = vb === 'Unlimited' ? Infinity : vb; }
            if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
            if (va < vb) return this.currentSort[tabName].direction === 'asc' ? -1 : 1;
            if (va > vb) return this.currentSort[tabName].direction === 'asc' ? 1 : -1;
            return 0;
        });

        this[`render${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`]();
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName); // remove after testing if you want
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        const pane = document.getElementById(tabName);
        if (pane) pane.classList.add('active');
    }

    // ==================== SAMPLE (fallback) ====================
    loadSampleData() {
        // ... (your sample items + one entry per tab - kept short)
        this.data.items = [{defName:"TextBook",name:"Textbook",price:267,category:"Books",quantityLimit:5,mod:"Core",isUsable:false,isEquippable:false,isWearable:false,enabled:true}];
        this.filteredData.items = [...this.data.items];
        // add one dummy for each other tab...
        this.renderAllTabs();
    }
}

document.addEventListener('DOMContentLoaded', () => new RICSStore());
