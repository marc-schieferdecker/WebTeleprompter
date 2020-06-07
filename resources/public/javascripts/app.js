/**
 * WebTelepromterApp class
 */
class WebTelepromterApp {
    /**
     * Constructor
     */
    constructor() {
        // Set active controller
        this.controller = null;
        this.setActiveController();

        // Function to check if pwa is running
        this.isInStandaloneMode = () => (window.matchMedia('(display-mode: fullscreen)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://');

        // Store2
        this.settings = store.namespace('settings');
        this.documents = store.namespace('documents');

        // Socket client
        this.socket = io('/');
        this.socket.on('connect', () => { console.log('socket connected'); });
        this.socket.on('welcome', (data) => { console.log('socketdata', data); });
        this.socket.on('broadcast', (data) => { this.socketDataHandler(data); });
        this.socket.on('disconnect', () => { console.log('socket disconnected'); });

        // Share documents
        this.sharingKey = '';
        this.importKey = '';
        this.sharingDocument = {};

        // JsRender config
        $.views.settings.delimiters("<%", "%>", "*");

        // Toastr config
        toastr.options.preventDuplicates = true;
        toastr.options.positionClass = 'toast-top-center mt-4';

        // Set language
        this.lang = $.cookie('lang');
    }

    /**
     * Start js in the local view
     */
    createView() {
        if(typeof createView === "function") {
            createView.call();
        }
    }

    /**
     * Create navigation for smooth page changes
     */
    createNavigation() {
        $('.navLink').each((k,element) => {
            $(element).on('click', (e) => {
                e.preventDefault();
                // Load content
                if(location.href !== $(element).prop('href')) {
                    this.getPage($(element).prop('href'));
                }
            });
        });
    }

    getPage(url) {
        $.get({
            url: url,
            success: (page) => {
                let pagecontent = $('#pagecontent');
                window.history.replaceState(url, page.match(/<title>(.*?)<\/title>/)[1], url);
                document.title = page.match(/<title>(.*?)<\/title>/)[1];
                this.setActiveController();
                pagecontent.fadeOut(100, () => {
                    pagecontent.html($('#pagecontent', page).html());
                    this.createView();
                    pagecontent.fadeIn(100);
                });
            }
        });
    }

    /**
     * Return if there are any settings in the store
     * @returns {boolean}
     */
    hasSettings() {
        return !!this.settings.size();
    }

    /**
     * Store settings
     * @param settings
     */
    setSettings(settings) {
        this.settings.set('settings', settings, true);
    }

    /**
     * Get all settings
     * @returns {store.StoredData}
     */
    getSettings() {
        return this.settings.getAll();
    }

    /**
     * Return if there are any documents in the store
     * @returns {boolean}
     */
    hasDocuments() {
        return !!this.documents.size();
    }

    /**
     * Remove document from document store
     * @param documentKey
     * @returns {any}
     */
    removeDocument(documentKey) {
        return this.documents.remove(documentKey);
    }

    /**
     * Update document in documents store
     * @param documentKey
     * @param documentTitle
     * @param documentBody
     * @returns {any}
     */
    updateDocument(documentKey, documentTitle, documentBody) {
        let data = {title: documentTitle, document: documentBody};
        return this.documents.set(documentKey, data, true);
    }

    /**
     * Add document to documents store
     * @param documentTitle
     * @param documentBody
     * @returns {any}
     */
    addDocument(documentTitle, documentBody) {
        let data = {title: documentTitle, document: documentBody};
        return this.documents.add(objectHash.MD5(data), data);
    }

    /**
     * Get document in store by key
     * @param documentKey
     * @returns {any}
     */
    getDocument(documentKey) {
        return this.documents.get(documentKey);
    }

    /**
     * Get all documents
     * @returns {store.StoredData}
     */
    getDocuments() {
        return this.documents.getAll();
    }

    /**
     * Set active controller in class and view
     */
    setActiveController() {
        if(location.href.includes('donate')) {
            this.controller = 'Donate';
        }
        else if(location.href.includes('settings')) {
            this.controller = 'Settings';
        }
        else if(location.href.includes('documents')) {
            this.controller = 'Documents';
        }
        else {
            this.controller = 'Home';
        }
        // Set menu element to active
        $('.nav-item').removeClass('active');
        $('.controller'+this.controller).addClass('active');
    }

    importDocument() {
        if(this.importKey !== '') {
            this.socket.emit('event', {getDocument: this.importKey});
        }
    }

    socketDataHandler(data) {
        if(data.getDocument) {
            if(data.getDocument === this.sharingKey && this.sharingKey !== '' && app.sharingDocument.title) {
                this.socket.emit('event', {sendDocument: this.sharingKey, document: this.sharingDocument});
                this.sharingKey = '';
                // Close modal
                if($('#sharingModal').length) {
                    $('#sharingModal').modal('hide');
                }
            }
        }
        if(data.sendDocument) {
            if(data.sendDocument === this.importKey && data.document.title && data.document.document) {
                this.addDocument(data.document.title, data.document.document);
                this.importKey = '';
                this.getPage('/documents');
            }
        }
    }
}