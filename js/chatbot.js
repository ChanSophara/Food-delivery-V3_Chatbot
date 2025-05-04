// chatbot.js - Enhanced Interactive Version with Ordering
$(function () {
    // Current language
    let currentLanguage = 'en';
    let isTyping = false;
    
    // Initialize chatbot
    function initChatbot() {
        updateLanguageUI();
        renderQuickSuggestions();
        setupEventListeners();
        initEmojiPicker();
    }
    
    // Initialize emoji picker
    function initEmojiPicker() {
        const emojis = {
            people: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
            food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🍾', '🧊', '🥄', '🍴', '🍽', '🥣', '🥡', '🥢', '🧂'],
            nature: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🐇', '🦝', '🦨', '🦦', '🦥', '🐁', '🐀', '🦔', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🐚', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌎', '🌍', '🌏', '🪐', '💫', '⭐️', '🌟', '✨', '⚡️', '☄️', '💥', '🔥', '🌈', '☀️', '🌤', '⛅️', '🌥', '☁️', '🌦', '🌧', '⛈', '🌩', '🌨', '❄️', '☃️', '⛄️', '🌬', '💨', '💧', '💦', '☔️', '☂️', '🌊', '🌫'],
            objects: ['⌚️', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '🧭', '⏱', '⏲', '⏰', '🕰', '⌛️', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯', '🧯', '🛢', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '🧸', '🖼', '🎀', '🎁', '🎗', '🎟', '🎫', '🎖', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽️', '⚾️', '🏀', '🏐', '🏈', '🏉', '🎾', '🎳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳️', '🎣', '🎽', '🎿', '🛷', '🥌', '🎯', '🎱', '🎮', '🎰', '🎲', '🧩', '♟', '🎭', '🎨', '🧵', '🧶', '🎼', '🎵', '🎶', '🎤', '🎧', '🎷', '🎸', '🎹', '🎺', '🎻', '🥁', '📱', '📲', '☎️', '📞', '📟', '📠', '🔋', '🔌', '💻', '🖥', '🖨', '⌨️', '🖱', '🖲', '💽', '💾', '💿', '📀', '🧮', '🎥', '🎞', '📽', '🎬', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯', '💡', '🔦', '🏮', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞', '📑', '🔖', '🏷', '💰', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '✉️', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳', '✏️', '✒️', '🖋', '🖊', '🖌', '🖍', '📝', '💼', '📁', '📂', '🗂', '📅', '📆', '🗒', '🗓', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇', '📏', '📐', '✂️', '🗃', '🗄', '🗑', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝', '🔨', '🪓', '⛏', '⚒', '🛠', '🗡', '⚔️', '🔫', '🏹', '🛡', '🔧', '🔩', '⚙️', '🗜', '⚖️', '🦯', '🔗', '⛓', '🧰', '🧲', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩺', '🚪', '🛏', '🛋', '🪑', '🚽', '🚿', '🛁', '🧴', '🧷', '🧹', '🧺', '🧻', '🧼', '🧽', '🧯', '🛒'],
            symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈️', '♉️', '♊️', '♋️', '♌️', '♍️', '♎️', '♏️', '♐️', '♑️', '♒️', '♓️', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚️', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕️', '🛑', '⛔️', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗️', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯️', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿️', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸', '⏯', '⏹', '⏺', '⏭', '⏮', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '+️⃣', '-️⃣', '✖️', '➗', '♾', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫️', '⚪️', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾️', '◽️', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛️', '⬜️', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁‍🗨', '💬', '💭', '🗯', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄️', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧']
        };

        const $emojiGrid = $('#emoji-grid');
        const $emojiCategories = $('.emoji-category');

        // Load first category by default
        loadEmojiCategory('people', emojis.people);

        // Handle category switching
        $emojiCategories.on('click', function() {
            const category = $(this).data('category');
            $emojiCategories.removeClass('active');
            $(this).addClass('active');
            $emojiGrid.empty();
            loadEmojiCategory(category, emojis[category]);
        });

        // Emoji click handler
        $(document).on('click', '.emoji-item', function() {
            const emoji = $(this).text();
            $('#user-input').val($('#user-input').val() + emoji);
            $('#emoji-picker').hide();
        });

        // Close emoji picker
        $('.emoji-picker-close').on('click', function() {
            $('#emoji-picker').hide();
        });

        // Toggle emoji picker
        $('#emoji-btn').on('click', function() {
            $('#emoji-picker').toggle();
        });
    }

    function loadEmojiCategory(category, emojis) {
        const $emojiGrid = $('#emoji-grid');
        emojis.forEach(emoji => {
            $emojiGrid.append(`<button class="emoji-item" title="${category} emoji">${emoji}</button>`);
        });
    }
    
    // Update UI based on current language
    function updateLanguageUI() {
        $('#user-input').attr('placeholder', currentLanguage === 'en' ? "Type your message here..." : "វាយបញ្ចូលសាររបស់អ្នកនៅទីនេះ...");
        $('#status-text').text(currentLanguage === 'en' ? "Online" : "អនឡាញ");
        $('#chatbot-name').text(currentLanguage === 'en' ? "Delicious Eats Bot" : "អ្នកជំនួយ Delicious Eats");
        $('#suggestions-title').html(currentLanguage === 'en' ? "💡 Quick Suggestions:" : "💡 ការណែនាំរហ័ស៖");
        
        renderQuickSuggestions();
        
        // Apply Khmer font if needed
        if (currentLanguage === 'km') {
            $('.chatbot-messages, .quick-suggestions').addClass('khmer-font');
        } else {
            $('.chatbot-messages, .quick-suggestions').removeClass('khmer-font');
        }
    }
    
    // Render quick suggestions
    function renderQuickSuggestions() {
        const suggestions = currentLanguage === 'en' ? [
            "📍 Location of the shop",
            "📞 Shop contact",
            "🍔 Show me the menu",
            "ℹ️ About us",
            "🕒 Open hours",
            "👥 Our team",
            "🎥 Our YouTube channel",
            "📦 How to order food",
            "🎉 Current promotions"
        ] : [
            "📍 ទីតាំងហាង",
            "📞 ទំនាក់ទំនងហាង",
            "🍔 បង្ហាញម៉ឺនុយ",
            "ℹ️ អំពីយើងខ្ញុំ",
            "🕒 ម៉ោងបើកហាង",
            "👥 ក្រុមការងាររបស់យើង",
            "🎥 ឆានែល YouTube របស់យើង",
            "📦 របៀបបញ្ជាទិញម្ហូប",
            "🎉 ការផ្តល់ជូនបច្ចុប្បន្ន"
        ];
        
        const $suggestionsContainer = $('#quick-suggestions');
        $suggestionsContainer.empty();
        
        suggestions.forEach(suggestion => {
            // Extract emoji and text
            const emoji = suggestion.match(/\p{Emoji}/u) ? suggestion.match(/\p{Emoji}/u)[0] : '';
            const text = suggestion.replace(emoji, '').trim();
            
            $suggestionsContainer.append(`
                <div class="quick-suggestion">
                    ${emoji ? `<span class="suggestion-emoji">${emoji}</span>` : ''}
                    <span class="suggestion-text">${text}</span>
                </div>
            `);
        });
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Send message on button click
        $('#send-button').on('click', sendMessage);
        
        // Send message on Enter key
        $('#user-input').on('keypress', function(e) {
            if (e.which === 13 && !e.shiftKey) { // Enter key without shift
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Quick suggestion click
        $(document).on('click', '.quick-suggestion', function() {
            const message = $(this).find('.suggestion-text').text().trim();
            $('#user-input').val(message);
            sendMessage();
        });
        
        // Quick reaction click
        $(document).on('click', '.quick-reaction', function() {
            const message = $(this).data('message');
            $('#user-input').val(message);
            sendMessage();
        });
        
        // Language change
        $('.language-btn').on('click', function() {
            currentLanguage = $(this).data('lang');
            $('.language-btn').removeClass('active');
            $(this).addClass('active');
            updateLanguageUI();
            
            // Add language change notification
            addBotMessage(currentLanguage === 'en' ? 
                "🌐 I've switched to English. How can I help you?" : 
                "🌐 ខ្ញុំបានប្តូរទៅភាសាខ្មែរ។ តើខ្ញុំអាចជួយអ្នកយ៉ាងដូចម្តេចខ្លះ?");
        });
        
        // Clear chat
        // Clear chat
$('#clear-chat').on('click', function() {
    $('#chat-messages').empty();
    addBotMessage(currentLanguage === 'en' ? 
        "👋 Hello! I'm your Delicious Eats assistant. How can I help you today?" : 
        "👋 សួស្តី! ខ្ញុំជាអ្នកជំនួយរបស់ Delicious Eats។ តើខ្ញុំអាចជួយអ្នកយ៉ាងដូចម្តេចខ្លះ?");
    // Add quick reactions
    const quickReactions = currentLanguage === 'en' ? [
        { text: "What's on the menu today?", emoji: "🍔" },
        { text: "How do I place an order?", emoji: "📦" },
        { text: "Location of the shop", emoji: "📍" }
    ] : [
        { text: "តើម៉ឺនុយថ្ងៃនេះមានអ្វីខ្លះ?", emoji: "🍔" },
        { text: "តើខ្ញុំអាចបញ្ជាទិញម្ហូបយ៉ាងដូចម្តេច?", emoji: "📦" },
        { text: "ទីតាំងហាង", emoji: "📍" }
    ];
    
    const $quickReactions = $('<div class="quick-reactions"></div>');
    quickReactions.forEach(reaction => {
        $quickReactions.append(`
            <button class="quick-reaction" data-message="${reaction.text}">
                ${reaction.emoji} ${reaction.text.split(' ')[0]}
            </button>
        `);
    });
    
    $('#chat-messages').append(`
        <div class="message bot-message welcome-message">
            <div class="message-content">
                <p>${currentLanguage === 'en' ? 
                    "👋 Hello! I'm your Delicious Eats assistant. How can I help you today?" : 
                    "👋 សួស្តី! ខ្ញុំជាអ្នកជំនួយរបស់ Delicious Eats។ តើខ្ញុំអាចជួយអ្នកយ៉ាងដូចម្តេចខ្លះ?"}</p>
                ${$quickReactions.prop('outerHTML')}
            </div>
            <div class="message-time">${getCurrentTime()}</div>
        </div>
    `);
});
        
        // Toggle suggestions
        $('#suggestions-toggle').on('click', function() {
            const $suggestions = $('#quick-suggestions');
            const $icon = $(this).find('i');
            
            if ($suggestions.is(':visible')) {
                $suggestions.slideUp();
                $icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
            } else {
                $suggestions.slideDown();
                $icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
            }
        });
    }
    
    // Send user message
    function sendMessage() {
        const message = $('#user-input').val().trim();
        if (message === '') return;
        
        // Add user message to chat
        addUserMessage(message);
        $('#user-input').val('');
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process message through RPC
        callRPCMethod(message);
    }
    
    // Call RPC method on server
    async function callRPCMethod(message) {
        try {
            const response = await fetch('http://localhost:5002/rpc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'processMessage',
                    params: {
                        message: message,
                        language: currentLanguage
                    },
                    id: Date.now()
                })
            });
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            // Process the response
            handleBotResponse(data.result);
            
        } catch (error) {
            console.error('RPC Error:', error);
            addBotMessage(currentLanguage === 'en' ? 
                "Sorry, I'm having trouble connecting to the server. Please try again later." : 
                "ខ្ញុំសុំទោស ខ្ញុំមានបញ្ហាក្នុងការភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។");
        } finally {
            hideTypingIndicator();
        }
    }
    
    // Handle bot response
    function handleBotResponse(response) {
        if (response.action === "add_to_cart") {
            // Add item to cart
            const { name, price, quantity, image } = response.data;
            Cart.addItem({
                name: name,
                price: price,
                qty: quantity,
                img: image
            });
            
            addBotMessage(response.message);
            showSuccessAnimation();
            
        } else if (response.action === "show_menu" || (response.items && response.action !== "message")) {
            // Display menu items
            addBotMessage(response.text || response.message);
            
            // Create a container for menu items
            const $menuContainer = $('<div class="menu-items-container"></div>');
            
            // Add each menu item
            response.items.forEach(item => {
                const $menuItem = $(`
                    <div class="menu-item">
                        <div class="menu-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="menu-item-details">
                            <h4>${item.name}</h4>
                            <p class="price">$${item.price.toFixed(2)}</p>
                            <p class="description">${item.desc}</p>
                            <button class="btn btn-sm add-to-cart-btn" 
                                    data-name="${item.name}" 
                                    data-price="${item.price}" 
                                    data-image="${item.image}">
                                ${currentLanguage === 'en' ? 'Add to Cart' : 'បន្ថែមទៅរទេះ'}
                            </button>
                        </div>
                    </div>
                `);
                
                $menuContainer.append($menuItem);
            });
            
            // Add to chat
            const $botMessage = $(`
                <div class="message bot-message">
                    <div class="message-content">
                        ${$menuContainer.prop('outerHTML')}
                    </div>
                    <div class="message-time">${getCurrentTime()}</div>
                </div>
            `);
            
            $('#chat-messages').append($botMessage);
            scrollToBottom();
            
        } else if (response.action === "map") {
            // Show map
            addBotMessage(response.text);
            
            const $mapContainer = $(`
                <div class="map-container">
                    <iframe src="${response.map_url}" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                </div>
            `);
            
            const $botMessage = $(`
                <div class="message bot-message">
                    <div class="message-content">
                        ${$mapContainer.prop('outerHTML')}
                    </div>
                    <div class="message-time">${getCurrentTime()}</div>
                </div>
            `);
            
            $('#chat-messages').append($botMessage);
            scrollToBottom();
            
        } else if (response.action === "team") {
            // Show team members
            addBotMessage(response.text);
            
            const $teamContainer = $('<div class="team-container grid grid-2"></div>');
            
            response.members.forEach(member => {
                const $memberCard = $(`
                    <div class="team-member-card">
                        <div class="team-member-image">
                            <img src="${member.image}" alt="${member.name}">
                        </div>
                        <div class="team-member-details">
                            <h4>${member.name}</h4>
                            <p class="position">${member.position}</p>
                            <p><strong>ID:</strong> ${member.id}</p>
                            <p><strong>Joined:</strong> ${member.joined}</p>
                            <p><strong>Experience:</strong> ${member.experience}</p>
                        </div>
                    </div>
                `);
                
                $teamContainer.append($memberCard);
            });
            
            const $botMessage = $(`
                <div class="message bot-message">
                    <div class="message-content">
                        ${$teamContainer.prop('outerHTML')}
                    </div>
                    <div class="message-time">${getCurrentTime()}</div>
                </div>
            `);
            
            $('#chat-messages').append($botMessage);
            scrollToBottom();
            
        } else if (response.action === "youtube") {
            // Show YouTube video
            addBotMessage(response.text);
            
            const $youtubeContainer = $(`
                <div class="youtube-container">
                    <iframe width="100%" height="315" src="${response.embed_url}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <p class="text-center mt-10"><a href="${response.url}" target="_blank">${currentLanguage === 'en' ? 'Open in YouTube' : 'បើកនៅ YouTube'}</a></p>
                </div>
            `);
            
            const $botMessage = $(`
                <div class="message bot-message">
                    <div class="message-content">
                        ${$youtubeContainer.prop('outerHTML')}
                    </div>
                    <div class="message-time">${getCurrentTime()}</div>
                </div>
            `);
            
            $('#chat-messages').append($botMessage);
            scrollToBottom();
            
        } else if (response.action === "promotions") {
            // Show promotions
            addBotMessage(response.text);
            
            const $promoContainer = $('<div class="promo-container"></div>');
            
            response.deals.forEach(promo => {
                const $promoCard = $(`
                    <div class="promo-card">
                        <h4>${promo.title}</h4>
                        <p>${promo.description}</p>
                        <p class="promo-code">${currentLanguage === 'en' ? 'Use code:' : 'កូដ៖'} <strong>${promo.code}</strong></p>
                    </div>
                `);
                
                $promoContainer.append($promoCard);
            });
            
            const $botMessage = $(`
                <div class="message bot-message">
                    <div class="message-content">
                        ${$promoContainer.prop('outerHTML')}
                    </div>
                    <div class="message-time">${getCurrentTime()}</div>
                </div>
            `);
            
            $('#chat-messages').append($botMessage);
            scrollToBottom();
            
        } else {
            // Regular message
            addBotMessage(response.message);
        }
    }
    
    // Show success animation when item is added to cart
    function showSuccessAnimation() {
        const $success = $('<div class="success-animation">✓</div>');
        $('body').append($success);
        
        setTimeout(() => {
            $success.addClass('animate');
            setTimeout(() => {
                $success.remove();
            }, 1000);
        }, 10);
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        isTyping = true;
        $('.typing-indicator').show();
        scrollToBottom();
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        isTyping = false;
        $('.typing-indicator').hide();
    }
    
    // Add user message to chat
    function addUserMessage(message) {
        const time = getCurrentTime();
        const $message = $(`
            <div class="message user-message">
                <div class="message-content">
                    <p>${message}</p>
                </div>
                <div class="message-time">${time}</div>
            </div>
        `);
        
        $('#chat-messages').append($message);
        scrollToBottom();
    }
    
    // Add bot message to chat
    function addBotMessage(message) {
        const time = getCurrentTime();
        const $message = $(`
            <div class="message bot-message">
                <div class="message-content">
                    <p>${message}</p>
                </div>
                <div class="message-time">${time}</div>
            </div>
        `);
        
        $('#chat-messages').append($message);
        scrollToBottom();
    }
    
    // Get current time in HH:MM format
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Scroll chat to bottom
    function scrollToBottom() {
        const $messages = $('#chat-messages');
        $messages.stop().animate({
            scrollTop: $messages[0].scrollHeight
        }, 300);
    }
    
    // Handle add to cart from menu items
    $(document).on('click', '.add-to-cart-btn', function() {
        const name = $(this).data('name');
        const price = $(this).data('price');
        const image = $(this).data('image');
        
        // Add to cart
        Cart.addItem({
            name: name,
            price: price,
            qty: 1,
            img: image
        });
        
        // Show success message
        const message = currentLanguage === 'en' 
            ? `Added 1 ${name} to your cart for $${price.toFixed(2)}` 
            : `បានបន្ថែម 1 ${name} ទៅក្នុងរទេះរបស់អ្នកសម្រាប់ $${price.toFixed(2)}`;
        
        addBotMessage(message);
        showSuccessAnimation();
    });
    
    // Initialize everything when DOM is ready
    initChatbot();
});