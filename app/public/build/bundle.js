
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * Schedules a callback to run immediately before the component is updated after any state change.
     *
     * The first time the callback runs will be before the initial `onMount`
     *
     * https://svelte.dev/docs#run-time-svelte-beforeupdate
     */
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.52.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction$1 = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const createInlineStyle = (disableInlineStyles, style) =>
    	disableInlineStyles ? {} : { style };
    const createMarkerProps = disableInlineStyles => ({
    	"aria-hidden": "true",
    	...createInlineStyle(disableInlineStyles, "display:none;"),
    });

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    const substr = (str, start, end) => str.substr(start, end);

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	substr(string, 0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction$1(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler =
    	handler =>
    	(...args) =>
    		handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     * @returns {{ pathname: string; search: string; hash: string }} The location
     *
     * @example
     * ```js
     * const path = "/search?q=falafel#result-3";
     * const location = parsePath(path);
     * // -> {
     * //   pathname: "/search",
     * //   search: "?q=falafel",
     * //   hash: "#result-3",
     * // };
     * ```
     */
    const parsePath = path => {
    	const searchIndex = path.indexOf("?");
    	const hashIndex = path.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex
    		? normalizeUrlFragment(substr(path, hashIndex))
    		: "";
    	const pathnameAndSearch = hasHashIndex ? substr(path, 0, hashIndex) : path;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(substr(pathnameAndSearch, searchIndex))
    		: "";
    	const pathname =
    		(hasSearchIndex
    			? substr(pathnameAndSearch, 0, searchIndex)
    			: pathnameAndSearch) || "/";
    	return { pathname, search, hash };
    };

    /**
     * Joins a location object to one path string.
     *
     * @param {{ pathname: string; search: string; hash: string }} location The location object
     * @returns {string} A path, created from the location
     *
     * @example
     * ```js
     * const location = {
     *   pathname: "/search",
     *   search: "?q=falafel",
     *   hash: "#result-3",
     * };
     * const path = stringifyPath(location);
     * // -> "/search?q=falafel#result-3"
     * ```
     */
    const stringifyPath = location => {
    	const { pathname, search, hash } = location;
    	return pathname + search + hash;
    };

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...parsePath(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query$1(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query$1(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query$1("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus =
    	(a11yConfig, announcementText, location) =>
    	(manageFocus, announceNavigation) =>
    		// Wait until the dom is updated, so we can look for headings
    		tick().then(() => {
    			if (!focusCandidate || initialNavigation) {
    				initialNavigationOccurred();
    				return;
    			}
    			if (manageFocus) {
    				handleFocus(focusCandidate.route);
    			}
    			if (a11yConfig.announcements && announceNavigation) {
    				const { path, fullPath, meta, params, uri } = focusCandidate.route;
    				const announcementMessage = a11yConfig.createAnnouncement(
    					{ path, fullPath, meta, params, uri },
    					get_store_value(location),
    				);
    				Promise.resolve(announcementMessage).then(message => {
    					announcementText.set(message);
    				});
    			}
    			clearFocusCandidate();
    		});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* ..\node_modules\.pnpm\svelte-navigator@3.2.2_besnmoibwkhwtentvwuriss7pa\node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.52.0 */

    const file$o = "..\\node_modules\\.pnpm\\svelte-navigator@3.2.2_besnmoibwkhwtentvwuriss7pa\\node_modules\\svelte-navigator\\src\\Router.svelte";

    // (204:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$7(ctx) {
    	let div;
    	let t;

    	let div_levels = [
    		{ role: "status" },
    		{ "aria-atomic": "true" },
    		{ "aria-live": "polite" },
    		{ "data-svnav-announcer": "" },
    		createInlineStyle(/*shouldDisableInlineStyles*/ ctx[6], visuallyHiddenStyle)
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			set_attributes(div, div_data);
    			add_location(div, file$o, 204, 1, 6149);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				{ role: "status" },
    				{ "aria-atomic": "true" },
    				{ "aria-live": "polite" },
    				{ "data-svnav-announcer": "" },
    				createInlineStyle(/*shouldDisableInlineStyles*/ ctx[6], visuallyHiddenStyle)
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(204:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;

    	let div_levels = [
    		createMarkerProps(/*shouldDisableInlineStyles*/ ctx[6]),
    		{ "data-svnav-router": /*routerId*/ ctx[3] }
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const default_slot_template = /*#slots*/ ctx[22].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[21], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_attributes(div, div_data);
    			add_location(div, file$o, 196, 0, 5982);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				createMarkerProps(/*shouldDisableInlineStyles*/ ctx[6]),
    				{ "data-svnav-router": /*routerId*/ ctx[3] }
    			]));

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 2097152)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[21],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[21])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[21], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$p($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;
    	let { disableInlineStyles = false } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));

    	const shouldDisableInlineStyles = routerContext
    	? routerContext.disableInlineStyles
    	: disableInlineStyles;

    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(20, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(18, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? parsePath(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(17, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(19, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath,
    		disableInlineStyles: shouldDisableInlineStyles
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y', 'disableInlineStyles'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(11, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(12, url = $$props.url);
    		if ('history' in $$props) $$invalidate(13, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(14, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(15, a11y = $$props.a11y);
    		if ('disableInlineStyles' in $$props) $$invalidate(16, disableInlineStyles = $$props.disableInlineStyles);
    		if ('$$scope' in $$props) $$invalidate(21, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createInlineStyle,
    		createMarkerProps,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		parsePath,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		disableInlineStyles,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		shouldDisableInlineStyles,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(11, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(12, url = $$props.url);
    		if ('history' in $$props) $$invalidate(13, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(14, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(15, a11y = $$props.a11y);
    		if ('disableInlineStyles' in $$props) $$invalidate(16, disableInlineStyles = $$props.disableInlineStyles);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 2048) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 1179648) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 655360) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 262144) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		shouldDisableInlineStyles,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		disableInlineStyles,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$p,
    			create_fragment$p,
    			safe_not_equal,
    			{
    				basepath: 11,
    				url: 12,
    				history: 13,
    				primary: 14,
    				a11y: 15,
    				disableInlineStyles: 16
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disableInlineStyles() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disableInlineStyles(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* ..\node_modules\.pnpm\svelte-navigator@3.2.2_besnmoibwkhwtentvwuriss7pa\node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.52.0 */
    const file$n = "..\\node_modules\\.pnpm\\svelte-navigator@3.2.2_besnmoibwkhwtentvwuriss7pa\\node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes$1 = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context$1 = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[10]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[11]
    });

    // (98:0) {#if isActive}
    function create_if_block$6(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 528409) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(98:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (114:2) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 524312)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(114:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (106:2) {#if component !== null}
    function create_if_block_1$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[11] },
    		isSSR ? get_store_value(/*params*/ ctx[10]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[12]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 7192)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 2048 && { navigate: /*navigate*/ ctx[11] },
    					dirty & /*isSSR, get, params, $params*/ 1040 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[10]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 4096 && get_spread_object(/*$$restProps*/ ctx[12])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(106:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (99:1) <Router {primary}>
    function create_default_slot$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(99:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;

    	let div0_levels = [
    		createMarkerProps(/*disableInlineStyles*/ ctx[7]),
    		{ "data-svnav-route-start": /*id*/ ctx[5] }
    	];

    	let div0_data = {};

    	for (let i = 0; i < div0_levels.length; i += 1) {
    		div0_data = assign(div0_data, div0_levels[i]);
    	}

    	let if_block = /*isActive*/ ctx[2] && create_if_block$6(ctx);

    	let div1_levels = [
    		createMarkerProps(/*disableInlineStyles*/ ctx[7]),
    		{ "data-svnav-route-end": /*id*/ ctx[5] }
    	];

    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_attributes(div0, div0_data);
    			add_location(div0, file$n, 96, 0, 2664);
    			set_attributes(div1, div1_data);
    			add_location(div1, file$n, 122, 0, 3340);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(div0, div0_data = get_spread_update(div0_levels, [
    				createMarkerProps(/*disableInlineStyles*/ ctx[7]),
    				{ "data-svnav-route-start": /*id*/ ctx[5] }
    			]));

    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [
    				createMarkerProps(/*disableInlineStyles*/ ctx[7]),
    				{ "data-svnav-route-end": /*id*/ ctx[5] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$o($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute, disableInlineStyles } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(17, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(12, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(13, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(14, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(19, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createMarkerProps,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		disableInlineStyles,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(13, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(14, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(15, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 155658) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(15, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 98304) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 98308) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		disableInlineStyles,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			path: 13,
    			component: 0,
    			meta: 14,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /* ..\node_modules\.pnpm\svelte-navigator@3.2.2_besnmoibwkhwtentvwuriss7pa\node_modules\svelte-navigator\src\Link.svelte generated by Svelte v3.52.0 */
    const file$m = "..\\node_modules\\.pnpm\\svelte-navigator@3.2.2_besnmoibwkhwtentvwuriss7pa\\node_modules\\svelte-navigator\\src\\Link.svelte";

    function create_fragment$n(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$m, 65, 0, 1861);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let isExactCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isExactCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (to === undefined && !('to' in $$props || $$self.$$.bound[$$self.$$.props['to']])) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	});

    	$$self.$$set = $$new_props => {
    		$$invalidate(19, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(18, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction: isFunction$1,
    		startsWith,
    		LINK_ID,
    		parsePath,
    		stringifyPath,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		isExactCurrent,
    		isCurrent,
    		isPartiallyCurrent,
    		props,
    		ariaCurrent,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(19, $$props = assign(assign({}, $$props), $$new_props));
    		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isExactCurrent' in $$props) isExactCurrent = $$new_props.isExactCurrent;
    		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 2080) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 2049) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			$$invalidate(9, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			isExactCurrent = parsePath(href) === stringifyPath($location);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 512) {
    			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(1, props = (() => {
    			if (isFunction$1(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isCurrent,
    		isPartiallyCurrent,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Link$1 = Link;

    const breadcrumbs = writable([]);

    const TEST_QUERY = {
        programme: {
            id: 14,
            name: "Psychology BSc",
        },
        categories: [
            {
                id: 41,
                name: "brain and nervous system disorders",
                parent_id: 5,
                relevance: 9.88838950049907,
                frequency: 405,
                count: 199,
            },
        ],
        tutors: [],
        topics: [],
        clients: [],
    };
    const query = writable(TEST_QUERY);

    /* src\components\Breadcrumbs.svelte generated by Svelte v3.52.0 */
    const file$l = "src\\components\\Breadcrumbs.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (7:4) <Link to={item.path}>
    function create_default_slot$2(ctx) {
    	let t_value = /*item*/ ctx[1].label + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 1 && t_value !== (t_value = /*item*/ ctx[1].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(7:4) <Link to={item.path}>",
    		ctx
    	});

    	return block;
    }

    // (6:2) {#each items as item}
    function create_each_block$7(ctx) {
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				to: /*item*/ ctx[1].path,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*items*/ 1) link_changes.to = /*item*/ ctx[1].path;

    			if (dirty & /*$$scope, items*/ 17) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(6:2) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let current;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "breadcrumbs");
    			add_location(div, file$l, 4, 0, 97);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*items*/ 1) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Breadcrumbs', slots, []);
    	let { items = [] } = $$props;
    	const writable_props = ['items'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Breadcrumbs> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    	};

    	$$self.$capture_state = () => ({ Link: Link$1, items });

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [items];
    }

    class Breadcrumbs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { items: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Breadcrumbs",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get items() {
    		throw new Error("<Breadcrumbs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Breadcrumbs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function isOutOfViewport (parent, container) {
        const parentBounding = parent.getBoundingClientRect();
        const boundingContainer = container.getBoundingClientRect();
        const out = {};

        out.top = parentBounding.top < 0;
        out.left = parentBounding.left < 0;
        out.bottom =
            parentBounding.bottom + boundingContainer.height >
            (window.innerHeight || document.documentElement.clientHeight);

        out.right =
            parentBounding.right >
            (window.innerWidth || document.documentElement.clientWidth);
        out.any = out.top || out.left || out.bottom || out.right;

        return out;
    }

    /* ..\node_modules\.pnpm\svelte-select@4.4.7\node_modules\svelte-select\src\Item.svelte generated by Svelte v3.52.0 */

    const file$k = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\Item.svelte";

    function create_fragment$l(ctx) {
    	let div;
    	let raw_value = /*getOptionLabel*/ ctx[0](/*item*/ ctx[1], /*filterText*/ ctx[2]) + "";
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "item " + /*itemClasses*/ ctx[3] + " svelte-3e0qet");
    			add_location(div, file$k, 78, 0, 1837);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getOptionLabel, item, filterText*/ 7 && raw_value !== (raw_value = /*getOptionLabel*/ ctx[0](/*item*/ ctx[1], /*filterText*/ ctx[2]) + "")) div.innerHTML = raw_value;
    			if (dirty & /*itemClasses*/ 8 && div_class_value !== (div_class_value = "item " + /*itemClasses*/ ctx[3] + " svelte-3e0qet")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Item', slots, []);
    	let { isActive = false } = $$props;
    	let { isFirst = false } = $$props;
    	let { isHover = false } = $$props;
    	let { isSelectable = false } = $$props;
    	let { getOptionLabel = undefined } = $$props;
    	let { item = undefined } = $$props;
    	let { filterText = '' } = $$props;
    	let itemClasses = '';

    	const writable_props = [
    		'isActive',
    		'isFirst',
    		'isHover',
    		'isSelectable',
    		'getOptionLabel',
    		'item',
    		'filterText'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Item> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isActive' in $$props) $$invalidate(4, isActive = $$props.isActive);
    		if ('isFirst' in $$props) $$invalidate(5, isFirst = $$props.isFirst);
    		if ('isHover' in $$props) $$invalidate(6, isHover = $$props.isHover);
    		if ('isSelectable' in $$props) $$invalidate(7, isSelectable = $$props.isSelectable);
    		if ('getOptionLabel' in $$props) $$invalidate(0, getOptionLabel = $$props.getOptionLabel);
    		if ('item' in $$props) $$invalidate(1, item = $$props.item);
    		if ('filterText' in $$props) $$invalidate(2, filterText = $$props.filterText);
    	};

    	$$self.$capture_state = () => ({
    		isActive,
    		isFirst,
    		isHover,
    		isSelectable,
    		getOptionLabel,
    		item,
    		filterText,
    		itemClasses
    	});

    	$$self.$inject_state = $$props => {
    		if ('isActive' in $$props) $$invalidate(4, isActive = $$props.isActive);
    		if ('isFirst' in $$props) $$invalidate(5, isFirst = $$props.isFirst);
    		if ('isHover' in $$props) $$invalidate(6, isHover = $$props.isHover);
    		if ('isSelectable' in $$props) $$invalidate(7, isSelectable = $$props.isSelectable);
    		if ('getOptionLabel' in $$props) $$invalidate(0, getOptionLabel = $$props.getOptionLabel);
    		if ('item' in $$props) $$invalidate(1, item = $$props.item);
    		if ('filterText' in $$props) $$invalidate(2, filterText = $$props.filterText);
    		if ('itemClasses' in $$props) $$invalidate(3, itemClasses = $$props.itemClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isActive, isFirst, isHover, item, isSelectable*/ 242) {
    			{
    				const classes = [];

    				if (isActive) {
    					classes.push('active');
    				}

    				if (isFirst) {
    					classes.push('first');
    				}

    				if (isHover) {
    					classes.push('hover');
    				}

    				if (item.isGroupHeader) {
    					classes.push('groupHeader');
    				}

    				if (item.isGroupItem) {
    					classes.push('groupItem');
    				}

    				if (!isSelectable) {
    					classes.push('notSelectable');
    				}

    				$$invalidate(3, itemClasses = classes.join(' '));
    			}
    		}
    	};

    	return [
    		getOptionLabel,
    		item,
    		filterText,
    		itemClasses,
    		isActive,
    		isFirst,
    		isHover,
    		isSelectable
    	];
    }

    class Item extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			isActive: 4,
    			isFirst: 5,
    			isHover: 6,
    			isSelectable: 7,
    			getOptionLabel: 0,
    			item: 1,
    			filterText: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Item",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get isActive() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isActive(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFirst() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFirst(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isHover() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isHover(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSelectable() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelectable(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getOptionLabel() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getOptionLabel(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get item() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterText() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterText(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ..\node_modules\.pnpm\svelte-select@4.4.7\node_modules\svelte-select\src\List.svelte generated by Svelte v3.52.0 */
    const file$j = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\List.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    // (309:4) {:else}
    function create_else_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_2(ctx);
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();

    			if (each_1_else) {
    				each_1_else.c();
    			}
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);

    			if (each_1_else) {
    				each_1_else.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*getGroupHeaderLabel, items, handleHover, handleClick, Item, filterText, getOptionLabel, value, optionIdentifier, hoverItemIndex, noOptionsMessage, hideEmptyState*/ 114390) {
    				each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block_2(ctx);
    					each_1_else.c();
    					each_1_else.m(each_1_anchor.parentNode, each_1_anchor);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    			if (each_1_else) each_1_else.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(309:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (286:4) {#if isVirtualList}
    function create_if_block$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*VirtualList*/ ctx[3];

    	function switch_props(ctx) {
    		return {
    			props: {
    				items: /*items*/ ctx[1],
    				itemHeight: /*itemHeight*/ ctx[8],
    				$$slots: {
    					default: [
    						create_default_slot$1,
    						({ item, i }) => ({ 41: item, 42: i }),
    						({ item, i }) => [0, (item ? 1024 : 0) | (i ? 2048 : 0)]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*items*/ 2) switch_instance_changes.items = /*items*/ ctx[1];
    			if (dirty[0] & /*itemHeight*/ 256) switch_instance_changes.itemHeight = /*itemHeight*/ ctx[8];

    			if (dirty[0] & /*Item, filterText, getOptionLabel, value, optionIdentifier, hoverItemIndex, items*/ 9814 | dirty[1] & /*$$scope, i, item*/ 11264) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*VirtualList*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(286:4) {#if isVirtualList}",
    		ctx
    	});

    	return block;
    }

    // (331:8) {:else}
    function create_else_block_2(ctx) {
    	let if_block_anchor;
    	let if_block = !/*hideEmptyState*/ ctx[11] && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*hideEmptyState*/ ctx[11]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(331:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (332:12) {#if !hideEmptyState}
    function create_if_block_2$1(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*noOptionsMessage*/ ctx[12]);
    			attr_dev(div, "class", "empty svelte-1uyqfml");
    			add_location(div, file$j, 332, 16, 10333);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*noOptionsMessage*/ 4096) set_data_dev(t, /*noOptionsMessage*/ ctx[12]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(332:12) {#if !hideEmptyState}",
    		ctx
    	});

    	return block;
    }

    // (313:12) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let switch_instance;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*Item*/ ctx[4];

    	function switch_props(ctx) {
    		return {
    			props: {
    				item: /*item*/ ctx[41],
    				filterText: /*filterText*/ ctx[13],
    				getOptionLabel: /*getOptionLabel*/ ctx[6],
    				isFirst: isItemFirst(/*i*/ ctx[42]),
    				isActive: isItemActive(/*item*/ ctx[41], /*value*/ ctx[9], /*optionIdentifier*/ ctx[10]),
    				isHover: isItemHover(/*hoverItemIndex*/ ctx[2], /*item*/ ctx[41], /*i*/ ctx[42], /*items*/ ctx[1]),
    				isSelectable: isItemSelectable(/*item*/ ctx[41])
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	function mouseover_handler_1() {
    		return /*mouseover_handler_1*/ ctx[29](/*i*/ ctx[42]);
    	}

    	function focus_handler_1() {
    		return /*focus_handler_1*/ ctx[30](/*i*/ ctx[42]);
    	}

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[31](/*item*/ ctx[41], /*i*/ ctx[42], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "listItem");
    			attr_dev(div, "tabindex", "-1");
    			add_location(div, file$j, 313, 16, 9513);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (switch_instance) mount_component(switch_instance, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseover", mouseover_handler_1, false, false, false),
    					listen_dev(div, "focus", focus_handler_1, false, false, false),
    					listen_dev(div, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const switch_instance_changes = {};
    			if (dirty[0] & /*items*/ 2) switch_instance_changes.item = /*item*/ ctx[41];
    			if (dirty[0] & /*filterText*/ 8192) switch_instance_changes.filterText = /*filterText*/ ctx[13];
    			if (dirty[0] & /*getOptionLabel*/ 64) switch_instance_changes.getOptionLabel = /*getOptionLabel*/ ctx[6];
    			if (dirty[0] & /*items, value, optionIdentifier*/ 1538) switch_instance_changes.isActive = isItemActive(/*item*/ ctx[41], /*value*/ ctx[9], /*optionIdentifier*/ ctx[10]);
    			if (dirty[0] & /*hoverItemIndex, items*/ 6) switch_instance_changes.isHover = isItemHover(/*hoverItemIndex*/ ctx[2], /*item*/ ctx[41], /*i*/ ctx[42], /*items*/ ctx[1]);
    			if (dirty[0] & /*items*/ 2) switch_instance_changes.isSelectable = isItemSelectable(/*item*/ ctx[41]);

    			if (switch_value !== (switch_value = /*Item*/ ctx[4])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, t);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(313:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (311:12) {#if item.isGroupHeader && !item.isSelectable}
    function create_if_block_1$2(ctx) {
    	let div;
    	let t_value = /*getGroupHeaderLabel*/ ctx[7](/*item*/ ctx[41]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "listGroupTitle svelte-1uyqfml");
    			add_location(div, file$j, 311, 16, 9415);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*getGroupHeaderLabel, items*/ 130 && t_value !== (t_value = /*getGroupHeaderLabel*/ ctx[7](/*item*/ ctx[41]) + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(311:12) {#if item.isGroupHeader && !item.isSelectable}",
    		ctx
    	});

    	return block;
    }

    // (310:8) {#each items as item, i}
    function create_each_block$6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*item*/ ctx[41].isGroupHeader && !/*item*/ ctx[41].isSelectable) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(310:8) {#each items as item, i}",
    		ctx
    	});

    	return block;
    }

    // (287:8) <svelte:component             this={VirtualList}             {items}             {itemHeight}             let:item             let:i>
    function create_default_slot$1(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*Item*/ ctx[4];

    	function switch_props(ctx) {
    		return {
    			props: {
    				item: /*item*/ ctx[41],
    				filterText: /*filterText*/ ctx[13],
    				getOptionLabel: /*getOptionLabel*/ ctx[6],
    				isFirst: isItemFirst(/*i*/ ctx[42]),
    				isActive: isItemActive(/*item*/ ctx[41], /*value*/ ctx[9], /*optionIdentifier*/ ctx[10]),
    				isHover: isItemHover(/*hoverItemIndex*/ ctx[2], /*item*/ ctx[41], /*i*/ ctx[42], /*items*/ ctx[1]),
    				isSelectable: isItemSelectable(/*item*/ ctx[41])
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	function mouseover_handler() {
    		return /*mouseover_handler*/ ctx[26](/*i*/ ctx[42]);
    	}

    	function focus_handler() {
    		return /*focus_handler*/ ctx[27](/*i*/ ctx[42]);
    	}

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[28](/*item*/ ctx[41], /*i*/ ctx[42], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "listItem");
    			add_location(div, file$j, 292, 12, 8621);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (switch_instance) mount_component(switch_instance, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseover", mouseover_handler, false, false, false),
    					listen_dev(div, "focus", focus_handler, false, false, false),
    					listen_dev(div, "click", click_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const switch_instance_changes = {};
    			if (dirty[1] & /*item*/ 1024) switch_instance_changes.item = /*item*/ ctx[41];
    			if (dirty[0] & /*filterText*/ 8192) switch_instance_changes.filterText = /*filterText*/ ctx[13];
    			if (dirty[0] & /*getOptionLabel*/ 64) switch_instance_changes.getOptionLabel = /*getOptionLabel*/ ctx[6];
    			if (dirty[1] & /*i*/ 2048) switch_instance_changes.isFirst = isItemFirst(/*i*/ ctx[42]);
    			if (dirty[0] & /*value, optionIdentifier*/ 1536 | dirty[1] & /*item*/ 1024) switch_instance_changes.isActive = isItemActive(/*item*/ ctx[41], /*value*/ ctx[9], /*optionIdentifier*/ ctx[10]);
    			if (dirty[0] & /*hoverItemIndex, items*/ 6 | dirty[1] & /*item, i*/ 3072) switch_instance_changes.isHover = isItemHover(/*hoverItemIndex*/ ctx[2], /*item*/ ctx[41], /*i*/ ctx[42], /*items*/ ctx[1]);
    			if (dirty[1] & /*item*/ 1024) switch_instance_changes.isSelectable = isItemSelectable(/*item*/ ctx[41]);

    			if (switch_value !== (switch_value = /*Item*/ ctx[4])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(287:8) <svelte:component             this={VirtualList}             {items}             {itemHeight}             let:item             let:i>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$5, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isVirtualList*/ ctx[5]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "listContainer svelte-1uyqfml");
    			attr_dev(div, "style", /*listStyle*/ ctx[14]);
    			toggle_class(div, "virtualList", /*isVirtualList*/ ctx[5]);
    			add_location(div, file$j, 280, 0, 8325);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			/*div_binding*/ ctx[32](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*handleKeyDown*/ ctx[17], false, false, false),
    					listen_dev(window, "resize", /*computePlacement*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			if (!current || dirty[0] & /*listStyle*/ 16384) {
    				attr_dev(div, "style", /*listStyle*/ ctx[14]);
    			}

    			if (!current || dirty[0] & /*isVirtualList*/ 32) {
    				toggle_class(div, "virtualList", /*isVirtualList*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			/*div_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function isItemActive(item, value, optionIdentifier) {
    	return value && value[optionIdentifier] === item[optionIdentifier];
    }

    function isItemFirst(itemIndex) {
    	return itemIndex === 0;
    }

    function isItemHover(hoverItemIndex, item, itemIndex, items) {
    	return isItemSelectable(item) && (hoverItemIndex === itemIndex || items.length === 1);
    }

    function isItemSelectable(item) {
    	return item.isGroupHeader && item.isSelectable || item.selectable || !item.hasOwnProperty('selectable'); // Default; if `selectable` was not specified, the object is selectable
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('List', slots, []);
    	const dispatch = createEventDispatcher();
    	let { container = undefined } = $$props;
    	let { VirtualList = null } = $$props;
    	let { Item: Item$1 = Item } = $$props;
    	let { isVirtualList = false } = $$props;
    	let { items = [] } = $$props;
    	let { labelIdentifier = 'label' } = $$props;

    	let { getOptionLabel = (option, filterText) => {
    		if (option) return option.isCreator
    		? `Create \"${filterText}\"`
    		: option[labelIdentifier];
    	} } = $$props;

    	let { getGroupHeaderLabel = null } = $$props;
    	let { itemHeight = 40 } = $$props;
    	let { hoverItemIndex = 0 } = $$props;
    	let { value = undefined } = $$props;
    	let { optionIdentifier = 'value' } = $$props;
    	let { hideEmptyState = false } = $$props;
    	let { noOptionsMessage = 'No options' } = $$props;
    	let { isMulti = false } = $$props;
    	let { activeItemIndex = 0 } = $$props;
    	let { filterText = '' } = $$props;
    	let { parent = null } = $$props;
    	let { listPlacement = null } = $$props;
    	let { listAutoWidth = null } = $$props;
    	let { listOffset = 5 } = $$props;
    	let isScrollingTimer = 0;
    	let isScrolling = false;
    	let prev_items;

    	onMount(() => {
    		if (items.length > 0 && !isMulti && value) {
    			const _hoverItemIndex = items.findIndex(item => item[optionIdentifier] === value[optionIdentifier]);

    			if (_hoverItemIndex) {
    				$$invalidate(2, hoverItemIndex = _hoverItemIndex);
    			}
    		}

    		scrollToActiveItem('active');

    		container.addEventListener(
    			'scroll',
    			() => {
    				clearTimeout(isScrollingTimer);

    				isScrollingTimer = setTimeout(
    					() => {
    						isScrolling = false;
    					},
    					100
    				);
    			},
    			false
    		);
    	});

    	beforeUpdate(() => {
    		if (!items) $$invalidate(1, items = []);

    		if (items !== prev_items && items.length > 0) {
    			$$invalidate(2, hoverItemIndex = 0);
    		}

    		prev_items = items;
    	});

    	function handleSelect(item) {
    		if (item.isCreator) return;
    		dispatch('itemSelected', item);
    	}

    	function handleHover(i) {
    		if (isScrolling) return;
    		$$invalidate(2, hoverItemIndex = i);
    	}

    	function handleClick(args) {
    		const { item, i, event } = args;
    		event.stopPropagation();
    		if (value && !isMulti && value[optionIdentifier] === item[optionIdentifier]) return closeList();

    		if (item.isCreator) {
    			dispatch('itemCreated', filterText);
    		} else if (isItemSelectable(item)) {
    			$$invalidate(19, activeItemIndex = i);
    			$$invalidate(2, hoverItemIndex = i);
    			handleSelect(item);
    		}
    	}

    	function closeList() {
    		dispatch('closeList');
    	}

    	async function updateHoverItem(increment) {
    		if (isVirtualList) return;
    		let isNonSelectableItem = true;

    		while (isNonSelectableItem) {
    			if (increment > 0 && hoverItemIndex === items.length - 1) {
    				$$invalidate(2, hoverItemIndex = 0);
    			} else if (increment < 0 && hoverItemIndex === 0) {
    				$$invalidate(2, hoverItemIndex = items.length - 1);
    			} else {
    				$$invalidate(2, hoverItemIndex = hoverItemIndex + increment);
    			}

    			isNonSelectableItem = !isItemSelectable(items[hoverItemIndex]);
    		}

    		await tick();
    		scrollToActiveItem('hover');
    	}

    	function handleKeyDown(e) {
    		switch (e.key) {
    			case 'Escape':
    				e.preventDefault();
    				closeList();
    				break;
    			case 'ArrowDown':
    				e.preventDefault();
    				items.length && updateHoverItem(1);
    				break;
    			case 'ArrowUp':
    				e.preventDefault();
    				items.length && updateHoverItem(-1);
    				break;
    			case 'Enter':
    				e.preventDefault();
    				if (items.length === 0) break;
    				const hoverItem = items[hoverItemIndex];
    				if (value && !isMulti && value[optionIdentifier] === hoverItem[optionIdentifier]) {
    					closeList();
    					break;
    				}
    				if (hoverItem.isCreator) {
    					dispatch('itemCreated', filterText);
    				} else {
    					$$invalidate(19, activeItemIndex = hoverItemIndex);
    					handleSelect(items[hoverItemIndex]);
    				}
    				break;
    			case 'Tab':
    				e.preventDefault();
    				if (items.length === 0) {
    					return closeList();
    				}
    				if (value && value[optionIdentifier] === items[hoverItemIndex][optionIdentifier]) return closeList();
    				$$invalidate(19, activeItemIndex = hoverItemIndex);
    				handleSelect(items[hoverItemIndex]);
    				break;
    		}
    	}

    	function scrollToActiveItem(className) {
    		if (isVirtualList || !container) return;
    		let offsetBounding;
    		const focusedElemBounding = container.querySelector(`.listItem .${className}`);

    		if (focusedElemBounding) {
    			offsetBounding = container.getBoundingClientRect().bottom - focusedElemBounding.getBoundingClientRect().bottom;
    		}

    		$$invalidate(0, container.scrollTop -= offsetBounding, container);
    	}

    	let listStyle;

    	function computePlacement() {
    		const { height, width } = parent.getBoundingClientRect();
    		$$invalidate(14, listStyle = '');
    		$$invalidate(14, listStyle += `min-width:${width}px;width:${listAutoWidth ? 'auto' : '100%'};`);

    		if (listPlacement === 'top' || listPlacement === 'auto' && isOutOfViewport(parent, container).bottom) {
    			$$invalidate(14, listStyle += `bottom:${height + listOffset}px;`);
    		} else {
    			$$invalidate(14, listStyle += `top:${height + listOffset}px;`);
    		}
    	}

    	const writable_props = [
    		'container',
    		'VirtualList',
    		'Item',
    		'isVirtualList',
    		'items',
    		'labelIdentifier',
    		'getOptionLabel',
    		'getGroupHeaderLabel',
    		'itemHeight',
    		'hoverItemIndex',
    		'value',
    		'optionIdentifier',
    		'hideEmptyState',
    		'noOptionsMessage',
    		'isMulti',
    		'activeItemIndex',
    		'filterText',
    		'parent',
    		'listPlacement',
    		'listAutoWidth',
    		'listOffset'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	const mouseover_handler = i => handleHover(i);
    	const focus_handler = i => handleHover(i);
    	const click_handler = (item, i, event) => handleClick({ item, i, event });
    	const mouseover_handler_1 = i => handleHover(i);
    	const focus_handler_1 = i => handleHover(i);
    	const click_handler_1 = (item, i, event) => handleClick({ item, i, event });

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('container' in $$props) $$invalidate(0, container = $$props.container);
    		if ('VirtualList' in $$props) $$invalidate(3, VirtualList = $$props.VirtualList);
    		if ('Item' in $$props) $$invalidate(4, Item$1 = $$props.Item);
    		if ('isVirtualList' in $$props) $$invalidate(5, isVirtualList = $$props.isVirtualList);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('labelIdentifier' in $$props) $$invalidate(20, labelIdentifier = $$props.labelIdentifier);
    		if ('getOptionLabel' in $$props) $$invalidate(6, getOptionLabel = $$props.getOptionLabel);
    		if ('getGroupHeaderLabel' in $$props) $$invalidate(7, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
    		if ('itemHeight' in $$props) $$invalidate(8, itemHeight = $$props.itemHeight);
    		if ('hoverItemIndex' in $$props) $$invalidate(2, hoverItemIndex = $$props.hoverItemIndex);
    		if ('value' in $$props) $$invalidate(9, value = $$props.value);
    		if ('optionIdentifier' in $$props) $$invalidate(10, optionIdentifier = $$props.optionIdentifier);
    		if ('hideEmptyState' in $$props) $$invalidate(11, hideEmptyState = $$props.hideEmptyState);
    		if ('noOptionsMessage' in $$props) $$invalidate(12, noOptionsMessage = $$props.noOptionsMessage);
    		if ('isMulti' in $$props) $$invalidate(21, isMulti = $$props.isMulti);
    		if ('activeItemIndex' in $$props) $$invalidate(19, activeItemIndex = $$props.activeItemIndex);
    		if ('filterText' in $$props) $$invalidate(13, filterText = $$props.filterText);
    		if ('parent' in $$props) $$invalidate(22, parent = $$props.parent);
    		if ('listPlacement' in $$props) $$invalidate(23, listPlacement = $$props.listPlacement);
    		if ('listAutoWidth' in $$props) $$invalidate(24, listAutoWidth = $$props.listAutoWidth);
    		if ('listOffset' in $$props) $$invalidate(25, listOffset = $$props.listOffset);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		createEventDispatcher,
    		onMount,
    		tick,
    		isOutOfViewport,
    		ItemComponent: Item,
    		dispatch,
    		container,
    		VirtualList,
    		Item: Item$1,
    		isVirtualList,
    		items,
    		labelIdentifier,
    		getOptionLabel,
    		getGroupHeaderLabel,
    		itemHeight,
    		hoverItemIndex,
    		value,
    		optionIdentifier,
    		hideEmptyState,
    		noOptionsMessage,
    		isMulti,
    		activeItemIndex,
    		filterText,
    		parent,
    		listPlacement,
    		listAutoWidth,
    		listOffset,
    		isScrollingTimer,
    		isScrolling,
    		prev_items,
    		handleSelect,
    		handleHover,
    		handleClick,
    		closeList,
    		updateHoverItem,
    		handleKeyDown,
    		scrollToActiveItem,
    		isItemActive,
    		isItemFirst,
    		isItemHover,
    		isItemSelectable,
    		listStyle,
    		computePlacement
    	});

    	$$self.$inject_state = $$props => {
    		if ('container' in $$props) $$invalidate(0, container = $$props.container);
    		if ('VirtualList' in $$props) $$invalidate(3, VirtualList = $$props.VirtualList);
    		if ('Item' in $$props) $$invalidate(4, Item$1 = $$props.Item);
    		if ('isVirtualList' in $$props) $$invalidate(5, isVirtualList = $$props.isVirtualList);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('labelIdentifier' in $$props) $$invalidate(20, labelIdentifier = $$props.labelIdentifier);
    		if ('getOptionLabel' in $$props) $$invalidate(6, getOptionLabel = $$props.getOptionLabel);
    		if ('getGroupHeaderLabel' in $$props) $$invalidate(7, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
    		if ('itemHeight' in $$props) $$invalidate(8, itemHeight = $$props.itemHeight);
    		if ('hoverItemIndex' in $$props) $$invalidate(2, hoverItemIndex = $$props.hoverItemIndex);
    		if ('value' in $$props) $$invalidate(9, value = $$props.value);
    		if ('optionIdentifier' in $$props) $$invalidate(10, optionIdentifier = $$props.optionIdentifier);
    		if ('hideEmptyState' in $$props) $$invalidate(11, hideEmptyState = $$props.hideEmptyState);
    		if ('noOptionsMessage' in $$props) $$invalidate(12, noOptionsMessage = $$props.noOptionsMessage);
    		if ('isMulti' in $$props) $$invalidate(21, isMulti = $$props.isMulti);
    		if ('activeItemIndex' in $$props) $$invalidate(19, activeItemIndex = $$props.activeItemIndex);
    		if ('filterText' in $$props) $$invalidate(13, filterText = $$props.filterText);
    		if ('parent' in $$props) $$invalidate(22, parent = $$props.parent);
    		if ('listPlacement' in $$props) $$invalidate(23, listPlacement = $$props.listPlacement);
    		if ('listAutoWidth' in $$props) $$invalidate(24, listAutoWidth = $$props.listAutoWidth);
    		if ('listOffset' in $$props) $$invalidate(25, listOffset = $$props.listOffset);
    		if ('isScrollingTimer' in $$props) isScrollingTimer = $$props.isScrollingTimer;
    		if ('isScrolling' in $$props) isScrolling = $$props.isScrolling;
    		if ('prev_items' in $$props) prev_items = $$props.prev_items;
    		if ('listStyle' in $$props) $$invalidate(14, listStyle = $$props.listStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*parent, container*/ 4194305) {
    			{
    				if (parent && container) computePlacement();
    			}
    		}
    	};

    	return [
    		container,
    		items,
    		hoverItemIndex,
    		VirtualList,
    		Item$1,
    		isVirtualList,
    		getOptionLabel,
    		getGroupHeaderLabel,
    		itemHeight,
    		value,
    		optionIdentifier,
    		hideEmptyState,
    		noOptionsMessage,
    		filterText,
    		listStyle,
    		handleHover,
    		handleClick,
    		handleKeyDown,
    		computePlacement,
    		activeItemIndex,
    		labelIdentifier,
    		isMulti,
    		parent,
    		listPlacement,
    		listAutoWidth,
    		listOffset,
    		mouseover_handler,
    		focus_handler,
    		click_handler,
    		mouseover_handler_1,
    		focus_handler_1,
    		click_handler_1,
    		div_binding
    	];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$k,
    			create_fragment$k,
    			safe_not_equal,
    			{
    				container: 0,
    				VirtualList: 3,
    				Item: 4,
    				isVirtualList: 5,
    				items: 1,
    				labelIdentifier: 20,
    				getOptionLabel: 6,
    				getGroupHeaderLabel: 7,
    				itemHeight: 8,
    				hoverItemIndex: 2,
    				value: 9,
    				optionIdentifier: 10,
    				hideEmptyState: 11,
    				noOptionsMessage: 12,
    				isMulti: 21,
    				activeItemIndex: 19,
    				filterText: 13,
    				parent: 22,
    				listPlacement: 23,
    				listAutoWidth: 24,
    				listOffset: 25
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get container() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get VirtualList() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set VirtualList(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Item() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Item(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isVirtualList() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isVirtualList(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelIdentifier() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelIdentifier(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getOptionLabel() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getOptionLabel(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getGroupHeaderLabel() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getGroupHeaderLabel(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemHeight() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemHeight(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hoverItemIndex() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoverItemIndex(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get optionIdentifier() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set optionIdentifier(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideEmptyState() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideEmptyState(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noOptionsMessage() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noOptionsMessage(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isMulti() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isMulti(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeItemIndex() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeItemIndex(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterText() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterText(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parent() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parent(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listPlacement() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listPlacement(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listAutoWidth() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listAutoWidth(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listOffset() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listOffset(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ..\node_modules\.pnpm\svelte-select@4.4.7\node_modules\svelte-select\src\Selection.svelte generated by Svelte v3.52.0 */

    const file$i = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\Selection.svelte";

    function create_fragment$j(ctx) {
    	let div;
    	let raw_value = /*getSelectionLabel*/ ctx[0](/*item*/ ctx[1]) + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "selection svelte-pu1q1n");
    			add_location(div, file$i, 13, 0, 230);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getSelectionLabel, item*/ 3 && raw_value !== (raw_value = /*getSelectionLabel*/ ctx[0](/*item*/ ctx[1]) + "")) div.innerHTML = raw_value;		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Selection', slots, []);
    	let { getSelectionLabel = undefined } = $$props;
    	let { item = undefined } = $$props;
    	const writable_props = ['getSelectionLabel', 'item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Selection> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('getSelectionLabel' in $$props) $$invalidate(0, getSelectionLabel = $$props.getSelectionLabel);
    		if ('item' in $$props) $$invalidate(1, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({ getSelectionLabel, item });

    	$$self.$inject_state = $$props => {
    		if ('getSelectionLabel' in $$props) $$invalidate(0, getSelectionLabel = $$props.getSelectionLabel);
    		if ('item' in $$props) $$invalidate(1, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [getSelectionLabel, item];
    }

    class Selection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { getSelectionLabel: 0, item: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Selection",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get getSelectionLabel() {
    		throw new Error("<Selection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getSelectionLabel(value) {
    		throw new Error("<Selection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get item() {
    		throw new Error("<Selection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Selection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ..\node_modules\.pnpm\svelte-select@4.4.7\node_modules\svelte-select\src\MultiSelection.svelte generated by Svelte v3.52.0 */
    const file$h = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\MultiSelection.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (87:8) {#if !isDisabled && !multiFullItemClearable}
    function create_if_block$4(ctx) {
    	let div;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[6](/*i*/ ctx[11], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124 l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z");
    			add_location(path, file$h, 97, 20, 3027);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "-2 -2 50 50");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "role", "presentation");
    			attr_dev(svg, "class", "svelte-liu9pa");
    			add_location(svg, file$h, 90, 16, 2775);
    			attr_dev(div, "class", "multiSelectItem_clear svelte-liu9pa");
    			add_location(div, file$h, 87, 12, 2647);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(87:8) {#if !isDisabled && !multiFullItemClearable}",
    		ctx
    	});

    	return block;
    }

    // (77:0) {#each value as item, i}
    function create_each_block$5(ctx) {
    	let div1;
    	let div0;
    	let raw_value = /*getSelectionLabel*/ ctx[4](/*item*/ ctx[9]) + "";
    	let t0;
    	let t1;
    	let div1_class_value;
    	let mounted;
    	let dispose;
    	let if_block = !/*isDisabled*/ ctx[2] && !/*multiFullItemClearable*/ ctx[3] && create_if_block$4(ctx);

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[7](/*i*/ ctx[11], ...args);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			attr_dev(div0, "class", "multiSelectItem_label svelte-liu9pa");
    			add_location(div0, file$h, 83, 8, 2487);
    			attr_dev(div1, "class", div1_class_value = "multiSelectItem " + (/*activeValue*/ ctx[1] === /*i*/ ctx[11] ? 'active' : '') + " " + (/*isDisabled*/ ctx[2] ? 'disabled' : '') + " svelte-liu9pa");
    			add_location(div1, file$h, 77, 4, 2256);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			div0.innerHTML = raw_value;
    			append_dev(div1, t0);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t1);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*getSelectionLabel, value*/ 17 && raw_value !== (raw_value = /*getSelectionLabel*/ ctx[4](/*item*/ ctx[9]) + "")) div0.innerHTML = raw_value;
    			if (!/*isDisabled*/ ctx[2] && !/*multiFullItemClearable*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(div1, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*activeValue, isDisabled*/ 6 && div1_class_value !== (div1_class_value = "multiSelectItem " + (/*activeValue*/ ctx[1] === /*i*/ ctx[11] ? 'active' : '') + " " + (/*isDisabled*/ ctx[2] ? 'disabled' : '') + " svelte-liu9pa")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(77:0) {#each value as item, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let each_1_anchor;
    	let each_value = /*value*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activeValue, isDisabled, multiFullItemClearable, handleClear, getSelectionLabel, value*/ 63) {
    				each_value = /*value*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MultiSelection', slots, []);
    	const dispatch = createEventDispatcher();
    	let { value = [] } = $$props;
    	let { activeValue = undefined } = $$props;
    	let { isDisabled = false } = $$props;
    	let { multiFullItemClearable = false } = $$props;
    	let { getSelectionLabel = undefined } = $$props;

    	function handleClear(i, event) {
    		event.stopPropagation();
    		dispatch('multiItemClear', { i });
    	}

    	const writable_props = [
    		'value',
    		'activeValue',
    		'isDisabled',
    		'multiFullItemClearable',
    		'getSelectionLabel'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MultiSelection> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (i, event) => handleClear(i, event);
    	const click_handler_1 = (i, event) => multiFullItemClearable ? handleClear(i, event) : {};

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('activeValue' in $$props) $$invalidate(1, activeValue = $$props.activeValue);
    		if ('isDisabled' in $$props) $$invalidate(2, isDisabled = $$props.isDisabled);
    		if ('multiFullItemClearable' in $$props) $$invalidate(3, multiFullItemClearable = $$props.multiFullItemClearable);
    		if ('getSelectionLabel' in $$props) $$invalidate(4, getSelectionLabel = $$props.getSelectionLabel);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		value,
    		activeValue,
    		isDisabled,
    		multiFullItemClearable,
    		getSelectionLabel,
    		handleClear
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('activeValue' in $$props) $$invalidate(1, activeValue = $$props.activeValue);
    		if ('isDisabled' in $$props) $$invalidate(2, isDisabled = $$props.isDisabled);
    		if ('multiFullItemClearable' in $$props) $$invalidate(3, multiFullItemClearable = $$props.multiFullItemClearable);
    		if ('getSelectionLabel' in $$props) $$invalidate(4, getSelectionLabel = $$props.getSelectionLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		activeValue,
    		isDisabled,
    		multiFullItemClearable,
    		getSelectionLabel,
    		handleClear,
    		click_handler,
    		click_handler_1
    	];
    }

    class MultiSelection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			value: 0,
    			activeValue: 1,
    			isDisabled: 2,
    			multiFullItemClearable: 3,
    			getSelectionLabel: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MultiSelection",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get value() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeValue() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeValue(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDisabled() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDisabled(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiFullItemClearable() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiFullItemClearable(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getSelectionLabel() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getSelectionLabel(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ..\node_modules\.pnpm\svelte-select@4.4.7\node_modules\svelte-select\src\VirtualList.svelte generated by Svelte v3.52.0 */
    const file$g = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\VirtualList.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    const get_default_slot_changes = dirty => ({
    	item: dirty & /*visible*/ 32,
    	i: dirty & /*visible*/ 32,
    	hoverItemIndex: dirty & /*hoverItemIndex*/ 2
    });

    const get_default_slot_context = ctx => ({
    	item: /*row*/ ctx[23].data,
    	i: /*row*/ ctx[23].index,
    	hoverItemIndex: /*hoverItemIndex*/ ctx[1]
    });

    // (154:69) Missing template
    function fallback_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Missing template");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(154:69) Missing template",
    		ctx
    	});

    	return block;
    }

    // (152:8) {#each visible as row (row.index)}
    function create_each_block$4(key_1, ctx) {
    	let svelte_virtual_list_row;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			svelte_virtual_list_row = element("svelte-virtual-list-row");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t = space();
    			set_custom_element_data(svelte_virtual_list_row, "class", "svelte-g2cagw");
    			add_location(svelte_virtual_list_row, file$g, 152, 12, 3778);
    			this.first = svelte_virtual_list_row;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_virtual_list_row, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svelte_virtual_list_row, null);
    			}

    			append_dev(svelte_virtual_list_row, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, visible, hoverItemIndex*/ 16418)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_virtual_list_row);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(152:8) {#each visible as row (row.index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let svelte_virtual_list_viewport;
    	let svelte_virtual_list_contents;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let svelte_virtual_list_viewport_resize_listener;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*visible*/ ctx[5];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*row*/ ctx[23].index;
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			svelte_virtual_list_viewport = element("svelte-virtual-list-viewport");
    			svelte_virtual_list_contents = element("svelte-virtual-list-contents");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(svelte_virtual_list_contents, "padding-top", /*top*/ ctx[6] + "px");
    			set_style(svelte_virtual_list_contents, "padding-bottom", /*bottom*/ ctx[7] + "px");
    			set_custom_element_data(svelte_virtual_list_contents, "class", "svelte-g2cagw");
    			add_location(svelte_virtual_list_contents, file$g, 148, 4, 3597);
    			set_style(svelte_virtual_list_viewport, "height", /*height*/ ctx[0]);
    			set_custom_element_data(svelte_virtual_list_viewport, "class", "svelte-g2cagw");
    			add_render_callback(() => /*svelte_virtual_list_viewport_elementresize_handler*/ ctx[18].call(svelte_virtual_list_viewport));
    			add_location(svelte_virtual_list_viewport, file$g, 143, 0, 3437);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_virtual_list_viewport, anchor);
    			append_dev(svelte_virtual_list_viewport, svelte_virtual_list_contents);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svelte_virtual_list_contents, null);
    			}

    			/*svelte_virtual_list_contents_binding*/ ctx[16](svelte_virtual_list_contents);
    			/*svelte_virtual_list_viewport_binding*/ ctx[17](svelte_virtual_list_viewport);
    			svelte_virtual_list_viewport_resize_listener = add_resize_listener(svelte_virtual_list_viewport, /*svelte_virtual_list_viewport_elementresize_handler*/ ctx[18].bind(svelte_virtual_list_viewport));
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(svelte_virtual_list_viewport, "scroll", /*handle_scroll*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$scope, visible, hoverItemIndex*/ 16418) {
    				each_value = /*visible*/ ctx[5];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, svelte_virtual_list_contents, outro_and_destroy_block, create_each_block$4, null, get_each_context$4);
    				check_outros();
    			}

    			if (!current || dirty & /*top*/ 64) {
    				set_style(svelte_virtual_list_contents, "padding-top", /*top*/ ctx[6] + "px");
    			}

    			if (!current || dirty & /*bottom*/ 128) {
    				set_style(svelte_virtual_list_contents, "padding-bottom", /*bottom*/ ctx[7] + "px");
    			}

    			if (!current || dirty & /*height*/ 1) {
    				set_style(svelte_virtual_list_viewport, "height", /*height*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_virtual_list_viewport);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*svelte_virtual_list_contents_binding*/ ctx[16](null);
    			/*svelte_virtual_list_viewport_binding*/ ctx[17](null);
    			svelte_virtual_list_viewport_resize_listener();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VirtualList', slots, ['default']);
    	let { items = undefined } = $$props;
    	let { height = '100%' } = $$props;
    	let { itemHeight = 40 } = $$props;
    	let { hoverItemIndex = 0 } = $$props;
    	let { start = 0 } = $$props;
    	let { end = 0 } = $$props;
    	let height_map = [];
    	let rows;
    	let viewport;
    	let contents;
    	let viewport_height = 0;
    	let visible;
    	let mounted;
    	let top = 0;
    	let bottom = 0;
    	let average_height;

    	async function refresh(items, viewport_height, itemHeight) {
    		const { scrollTop } = viewport;
    		await tick();
    		let content_height = top - scrollTop;
    		let i = start;

    		while (content_height < viewport_height && i < items.length) {
    			let row = rows[i - start];

    			if (!row) {
    				$$invalidate(10, end = i + 1);
    				await tick();
    				row = rows[i - start];
    			}

    			const row_height = height_map[i] = itemHeight || row.offsetHeight;
    			content_height += row_height;
    			i += 1;
    		}

    		$$invalidate(10, end = i);
    		const remaining = items.length - end;
    		average_height = (top + content_height) / end;
    		$$invalidate(7, bottom = remaining * average_height);
    		height_map.length = items.length;
    		if (viewport) $$invalidate(3, viewport.scrollTop = 0, viewport);
    	}

    	async function handle_scroll() {
    		const { scrollTop } = viewport;
    		const old_start = start;

    		for (let v = 0; v < rows.length; v += 1) {
    			height_map[start + v] = itemHeight || rows[v].offsetHeight;
    		}

    		let i = 0;
    		let y = 0;

    		while (i < items.length) {
    			const row_height = height_map[i] || average_height;

    			if (y + row_height > scrollTop) {
    				$$invalidate(9, start = i);
    				$$invalidate(6, top = y);
    				break;
    			}

    			y += row_height;
    			i += 1;
    		}

    		while (i < items.length) {
    			y += height_map[i] || average_height;
    			i += 1;
    			if (y > scrollTop + viewport_height) break;
    		}

    		$$invalidate(10, end = i);
    		const remaining = items.length - end;
    		average_height = y / end;
    		while (i < items.length) height_map[i++] = average_height;
    		$$invalidate(7, bottom = remaining * average_height);

    		if (start < old_start) {
    			await tick();
    			let expected_height = 0;
    			let actual_height = 0;

    			for (let i = start; i < old_start; i += 1) {
    				if (rows[i - start]) {
    					expected_height += height_map[i];
    					actual_height += itemHeight || rows[i - start].offsetHeight;
    				}
    			}

    			const d = actual_height - expected_height;
    			viewport.scrollTo(0, scrollTop + d);
    		}
    	}

    	onMount(() => {
    		rows = contents.getElementsByTagName('svelte-virtual-list-row');
    		$$invalidate(13, mounted = true);
    	});

    	const writable_props = ['items', 'height', 'itemHeight', 'hoverItemIndex', 'start', 'end'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VirtualList> was created with unknown prop '${key}'`);
    	});

    	function svelte_virtual_list_contents_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			contents = $$value;
    			$$invalidate(4, contents);
    		});
    	}

    	function svelte_virtual_list_viewport_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			viewport = $$value;
    			$$invalidate(3, viewport);
    		});
    	}

    	function svelte_virtual_list_viewport_elementresize_handler() {
    		viewport_height = this.offsetHeight;
    		$$invalidate(2, viewport_height);
    	}

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(11, items = $$props.items);
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('itemHeight' in $$props) $$invalidate(12, itemHeight = $$props.itemHeight);
    		if ('hoverItemIndex' in $$props) $$invalidate(1, hoverItemIndex = $$props.hoverItemIndex);
    		if ('start' in $$props) $$invalidate(9, start = $$props.start);
    		if ('end' in $$props) $$invalidate(10, end = $$props.end);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		tick,
    		items,
    		height,
    		itemHeight,
    		hoverItemIndex,
    		start,
    		end,
    		height_map,
    		rows,
    		viewport,
    		contents,
    		viewport_height,
    		visible,
    		mounted,
    		top,
    		bottom,
    		average_height,
    		refresh,
    		handle_scroll
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(11, items = $$props.items);
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('itemHeight' in $$props) $$invalidate(12, itemHeight = $$props.itemHeight);
    		if ('hoverItemIndex' in $$props) $$invalidate(1, hoverItemIndex = $$props.hoverItemIndex);
    		if ('start' in $$props) $$invalidate(9, start = $$props.start);
    		if ('end' in $$props) $$invalidate(10, end = $$props.end);
    		if ('height_map' in $$props) height_map = $$props.height_map;
    		if ('rows' in $$props) rows = $$props.rows;
    		if ('viewport' in $$props) $$invalidate(3, viewport = $$props.viewport);
    		if ('contents' in $$props) $$invalidate(4, contents = $$props.contents);
    		if ('viewport_height' in $$props) $$invalidate(2, viewport_height = $$props.viewport_height);
    		if ('visible' in $$props) $$invalidate(5, visible = $$props.visible);
    		if ('mounted' in $$props) $$invalidate(13, mounted = $$props.mounted);
    		if ('top' in $$props) $$invalidate(6, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(7, bottom = $$props.bottom);
    		if ('average_height' in $$props) average_height = $$props.average_height;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*items, start, end*/ 3584) {
    			$$invalidate(5, visible = items.slice(start, end).map((data, i) => {
    				return { index: i + start, data };
    			}));
    		}

    		if ($$self.$$.dirty & /*mounted, items, viewport_height, itemHeight*/ 14340) {
    			if (mounted) refresh(items, viewport_height, itemHeight);
    		}
    	};

    	return [
    		height,
    		hoverItemIndex,
    		viewport_height,
    		viewport,
    		contents,
    		visible,
    		top,
    		bottom,
    		handle_scroll,
    		start,
    		end,
    		items,
    		itemHeight,
    		mounted,
    		$$scope,
    		slots,
    		svelte_virtual_list_contents_binding,
    		svelte_virtual_list_viewport_binding,
    		svelte_virtual_list_viewport_elementresize_handler
    	];
    }

    class VirtualList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			items: 11,
    			height: 0,
    			itemHeight: 12,
    			hoverItemIndex: 1,
    			start: 9,
    			end: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VirtualList",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get items() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemHeight() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemHeight(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hoverItemIndex() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoverItemIndex(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ..\node_modules\.pnpm\svelte-select@4.4.7\node_modules\svelte-select\src\ClearIcon.svelte generated by Svelte v3.52.0 */

    const file$f = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\ClearIcon.svelte";

    function create_fragment$g(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124\n    l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z");
    			add_location(path, file$f, 8, 4, 141);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "-2 -2 50 50");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "role", "presentation");
    			add_location(svg, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ClearIcon', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ClearIcon> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class ClearIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClearIcon",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    function debounce(func, wait, immediate) {
        let timeout;

        return function executedFunction() {
            let context = this;
            let args = arguments;

            let later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };

            let callNow = immediate && !timeout;

            clearTimeout(timeout);

            timeout = setTimeout(later, wait);

            if (callNow) func.apply(context, args);
        };
    }

    /* ..\node_modules\.pnpm\svelte-select@4.4.7\node_modules\svelte-select\src\Select.svelte generated by Svelte v3.52.0 */

    const { Object: Object_1, console: console_1$2 } = globals;
    const file$e = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\Select.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[103] = list[i];
    	return child_ctx;
    }

    // (876:8) {#if isFocused}
    function create_if_block_10(ctx) {
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t2;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t0 = text(/*ariaSelection*/ ctx[33]);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(/*ariaContext*/ ctx[32]);
    			attr_dev(span0, "id", "aria-selection");
    			add_location(span0, file$e, 876, 12, 23842);
    			attr_dev(span1, "id", "aria-context");
    			add_location(span1, file$e, 877, 12, 23903);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			append_dev(span0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*ariaSelection*/ 4) set_data_dev(t0, /*ariaSelection*/ ctx[33]);
    			if (dirty[1] & /*ariaContext*/ 2) set_data_dev(t2, /*ariaContext*/ ctx[32]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(876:8) {#if isFocused}",
    		ctx
    	});

    	return block;
    }

    // (884:4) {#if Icon}
    function create_if_block_9(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*iconProps*/ ctx[18]];
    	var switch_value = /*Icon*/ ctx[17];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[0] & /*iconProps*/ 262144)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*iconProps*/ ctx[18])])
    			: {};

    			if (switch_value !== (switch_value = /*Icon*/ ctx[17])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(884:4) {#if Icon}",
    		ctx
    	});

    	return block;
    }

    // (888:4) {#if showMultiSelect}
    function create_if_block_8(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*MultiSelection*/ ctx[26];

    	function switch_props(ctx) {
    		return {
    			props: {
    				value: /*value*/ ctx[2],
    				getSelectionLabel: /*getSelectionLabel*/ ctx[12],
    				activeValue: /*activeValue*/ ctx[30],
    				isDisabled: /*isDisabled*/ ctx[9],
    				multiFullItemClearable: /*multiFullItemClearable*/ ctx[8]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    		switch_instance.$on("multiItemClear", /*handleMultiItemClear*/ ctx[38]);
    		switch_instance.$on("focus", /*handleFocus*/ ctx[40]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*value*/ 4) switch_instance_changes.value = /*value*/ ctx[2];
    			if (dirty[0] & /*getSelectionLabel*/ 4096) switch_instance_changes.getSelectionLabel = /*getSelectionLabel*/ ctx[12];
    			if (dirty[0] & /*activeValue*/ 1073741824) switch_instance_changes.activeValue = /*activeValue*/ ctx[30];
    			if (dirty[0] & /*isDisabled*/ 512) switch_instance_changes.isDisabled = /*isDisabled*/ ctx[9];
    			if (dirty[0] & /*multiFullItemClearable*/ 256) switch_instance_changes.multiFullItemClearable = /*multiFullItemClearable*/ ctx[8];

    			if (switch_value !== (switch_value = /*MultiSelection*/ ctx[26])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					switch_instance.$on("multiItemClear", /*handleMultiItemClear*/ ctx[38]);
    					switch_instance.$on("focus", /*handleFocus*/ ctx[40]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(888:4) {#if showMultiSelect}",
    		ctx
    	});

    	return block;
    }

    // (910:4) {#if !isMulti && showSelectedItem}
    function create_if_block_7(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*Selection*/ ctx[25];

    	function switch_props(ctx) {
    		return {
    			props: {
    				item: /*value*/ ctx[2],
    				getSelectionLabel: /*getSelectionLabel*/ ctx[12]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "selectedItem svelte-17l1npl");
    			add_location(div, file$e, 910, 8, 24725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (switch_instance) mount_component(switch_instance, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "focus", /*handleFocus*/ ctx[40], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*value*/ 4) switch_instance_changes.item = /*value*/ ctx[2];
    			if (dirty[0] & /*getSelectionLabel*/ 4096) switch_instance_changes.getSelectionLabel = /*getSelectionLabel*/ ctx[12];

    			if (switch_value !== (switch_value = /*Selection*/ ctx[25])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(910:4) {#if !isMulti && showSelectedItem}",
    		ctx
    	});

    	return block;
    }

    // (919:4) {#if showClearIcon}
    function create_if_block_6(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*ClearIcon*/ ctx[23];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "clearSelect svelte-17l1npl");
    			attr_dev(div, "aria-hidden", "true");
    			add_location(div, file$e, 919, 8, 24964);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (switch_instance) mount_component(switch_instance, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", prevent_default(/*handleClear*/ ctx[27]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*ClearIcon*/ ctx[23])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(919:4) {#if showClearIcon}",
    		ctx
    	});

    	return block;
    }

    // (928:4) {#if !showClearIcon && (showIndicator || (showChevron && !value) || (!isSearchable && !isDisabled && !isWaiting && ((showSelectedItem && !isClearable) || !showSelectedItem)))}
    function create_if_block_4(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*indicatorSvg*/ ctx[22]) return create_if_block_5;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "indicator svelte-17l1npl");
    			attr_dev(div, "aria-hidden", "true");
    			add_location(div, file$e, 928, 8, 25347);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(928:4) {#if !showClearIcon && (showIndicator || (showChevron && !value) || (!isSearchable && !isDisabled && !isWaiting && ((showSelectedItem && !isClearable) || !showSelectedItem)))}",
    		ctx
    	});

    	return block;
    }

    // (932:12) {:else}
    function create_else_block(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747\n          3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0\n          1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502\n          0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0\n          0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z");
    			add_location(path, file$e, 938, 20, 25704);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", "svelte-17l1npl");
    			add_location(svg, file$e, 932, 16, 25494);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(932:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (930:12) {#if indicatorSvg}
    function create_if_block_5(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*indicatorSvg*/ ctx[22], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*indicatorSvg*/ 4194304) html_tag.p(/*indicatorSvg*/ ctx[22]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(930:12) {#if indicatorSvg}",
    		ctx
    	});

    	return block;
    }

    // (950:4) {#if isWaiting}
    function create_if_block_3(ctx) {
    	let div;
    	let svg;
    	let circle;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "spinner_path svelte-17l1npl");
    			attr_dev(circle, "cx", "50");
    			attr_dev(circle, "cy", "50");
    			attr_dev(circle, "r", "20");
    			attr_dev(circle, "fill", "none");
    			attr_dev(circle, "stroke", "currentColor");
    			attr_dev(circle, "stroke-width", "5");
    			attr_dev(circle, "stroke-miterlimit", "10");
    			add_location(circle, file$e, 952, 16, 26253);
    			attr_dev(svg, "class", "spinner_icon svelte-17l1npl");
    			attr_dev(svg, "viewBox", "25 25 50 50");
    			add_location(svg, file$e, 951, 12, 26188);
    			attr_dev(div, "class", "spinner svelte-17l1npl");
    			add_location(div, file$e, 950, 8, 26154);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, circle);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(950:4) {#if isWaiting}",
    		ctx
    	});

    	return block;
    }

    // (966:4) {#if listOpen}
    function create_if_block_2(ctx) {
    	let switch_instance;
    	let updating_hoverItemIndex;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*listProps*/ ctx[34]];

    	function switch_instance_hoverItemIndex_binding(value) {
    		/*switch_instance_hoverItemIndex_binding*/ ctx[84](value);
    	}

    	var switch_value = /*List*/ ctx[24];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		if (/*hoverItemIndex*/ ctx[28] !== void 0) {
    			switch_instance_props.hoverItemIndex = /*hoverItemIndex*/ ctx[28];
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance, 'hoverItemIndex', switch_instance_hoverItemIndex_binding));
    		switch_instance.$on("itemSelected", /*itemSelected*/ ctx[43]);
    		switch_instance.$on("itemCreated", /*itemCreated*/ ctx[44]);
    		switch_instance.$on("closeList", /*closeList*/ ctx[45]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[1] & /*listProps*/ 8)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*listProps*/ ctx[34])])
    			: {};

    			if (!updating_hoverItemIndex && dirty[0] & /*hoverItemIndex*/ 268435456) {
    				updating_hoverItemIndex = true;
    				switch_instance_changes.hoverItemIndex = /*hoverItemIndex*/ ctx[28];
    				add_flush_callback(() => updating_hoverItemIndex = false);
    			}

    			if (switch_value !== (switch_value = /*List*/ ctx[24])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance, 'hoverItemIndex', switch_instance_hoverItemIndex_binding));
    					switch_instance.$on("itemSelected", /*itemSelected*/ ctx[43]);
    					switch_instance.$on("itemCreated", /*itemCreated*/ ctx[44]);
    					switch_instance.$on("closeList", /*closeList*/ ctx[45]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(966:4) {#if listOpen}",
    		ctx
    	});

    	return block;
    }

    // (976:4) {#if !isMulti || (isMulti && !showMultiSelect)}
    function create_if_block_1$1(ctx) {
    	let input_1;
    	let input_1_name_value;
    	let input_1_value_value;

    	const block = {
    		c: function create() {
    			input_1 = element("input");
    			attr_dev(input_1, "name", input_1_name_value = /*inputAttributes*/ ctx[16].name);
    			attr_dev(input_1, "type", "hidden");

    			input_1.value = input_1_value_value = /*value*/ ctx[2]
    			? /*getSelectionLabel*/ ctx[12](/*value*/ ctx[2])
    			: null;

    			attr_dev(input_1, "class", "svelte-17l1npl");
    			add_location(input_1, file$e, 976, 8, 26910);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*inputAttributes*/ 65536 && input_1_name_value !== (input_1_name_value = /*inputAttributes*/ ctx[16].name)) {
    				attr_dev(input_1, "name", input_1_name_value);
    			}

    			if (dirty[0] & /*value, getSelectionLabel*/ 4100 && input_1_value_value !== (input_1_value_value = /*value*/ ctx[2]
    			? /*getSelectionLabel*/ ctx[12](/*value*/ ctx[2])
    			: null)) {
    				prop_dev(input_1, "value", input_1_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(976:4) {#if !isMulti || (isMulti && !showMultiSelect)}",
    		ctx
    	});

    	return block;
    }

    // (983:4) {#if isMulti && showMultiSelect}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*value*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*inputAttributes, value, getSelectionLabel*/ 69636) {
    				each_value = /*value*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(983:4) {#if isMulti && showMultiSelect}",
    		ctx
    	});

    	return block;
    }

    // (984:8) {#each value as item}
    function create_each_block$3(ctx) {
    	let input_1;
    	let input_1_name_value;
    	let input_1_value_value;

    	const block = {
    		c: function create() {
    			input_1 = element("input");
    			attr_dev(input_1, "name", input_1_name_value = /*inputAttributes*/ ctx[16].name);
    			attr_dev(input_1, "type", "hidden");

    			input_1.value = input_1_value_value = /*item*/ ctx[103]
    			? /*getSelectionLabel*/ ctx[12](/*item*/ ctx[103])
    			: null;

    			attr_dev(input_1, "class", "svelte-17l1npl");
    			add_location(input_1, file$e, 984, 12, 27136);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*inputAttributes*/ 65536 && input_1_name_value !== (input_1_name_value = /*inputAttributes*/ ctx[16].name)) {
    				attr_dev(input_1, "name", input_1_name_value);
    			}

    			if (dirty[0] & /*value, getSelectionLabel*/ 4100 && input_1_value_value !== (input_1_value_value = /*item*/ ctx[103]
    			? /*getSelectionLabel*/ ctx[12](/*item*/ ctx[103])
    			: null)) {
    				prop_dev(input_1, "value", input_1_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(984:8) {#each value as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let span;
    	let t0;
    	let t1;
    	let t2;
    	let input_1;
    	let input_1_readonly_value;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*isFocused*/ ctx[1] && create_if_block_10(ctx);
    	let if_block1 = /*Icon*/ ctx[17] && create_if_block_9(ctx);
    	let if_block2 = /*showMultiSelect*/ ctx[35] && create_if_block_8(ctx);

    	let input_1_levels = [
    		{
    			readOnly: input_1_readonly_value = !/*isSearchable*/ ctx[13]
    		},
    		/*_inputAttributes*/ ctx[31],
    		{ placeholder: /*placeholderText*/ ctx[36] },
    		{ style: /*inputStyles*/ ctx[14] },
    		{ disabled: /*isDisabled*/ ctx[9] }
    	];

    	let input_1_data = {};

    	for (let i = 0; i < input_1_levels.length; i += 1) {
    		input_1_data = assign(input_1_data, input_1_levels[i]);
    	}

    	let if_block3 = !/*isMulti*/ ctx[7] && /*showSelectedItem*/ ctx[29] && create_if_block_7(ctx);
    	let if_block4 = /*showClearIcon*/ ctx[37] && create_if_block_6(ctx);
    	let if_block5 = !/*showClearIcon*/ ctx[37] && (/*showIndicator*/ ctx[20] || /*showChevron*/ ctx[19] && !/*value*/ ctx[2] || !/*isSearchable*/ ctx[13] && !/*isDisabled*/ ctx[9] && !/*isWaiting*/ ctx[4] && (/*showSelectedItem*/ ctx[29] && !/*isClearable*/ ctx[15] || !/*showSelectedItem*/ ctx[29])) && create_if_block_4(ctx);
    	let if_block6 = /*isWaiting*/ ctx[4] && create_if_block_3(ctx);
    	let if_block7 = /*listOpen*/ ctx[5] && create_if_block_2(ctx);
    	let if_block8 = (!/*isMulti*/ ctx[7] || /*isMulti*/ ctx[7] && !/*showMultiSelect*/ ctx[35]) && create_if_block_1$1(ctx);
    	let if_block9 = /*isMulti*/ ctx[7] && /*showMultiSelect*/ ctx[35] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			input_1 = element("input");
    			t3 = space();
    			if (if_block3) if_block3.c();
    			t4 = space();
    			if (if_block4) if_block4.c();
    			t5 = space();
    			if (if_block5) if_block5.c();
    			t6 = space();
    			if (if_block6) if_block6.c();
    			t7 = space();
    			if (if_block7) if_block7.c();
    			t8 = space();
    			if (if_block8) if_block8.c();
    			t9 = space();
    			if (if_block9) if_block9.c();
    			attr_dev(span, "aria-live", "polite");
    			attr_dev(span, "aria-atomic", "false");
    			attr_dev(span, "aria-relevant", "additions text");
    			attr_dev(span, "class", "a11yText svelte-17l1npl");
    			add_location(span, file$e, 870, 4, 23680);
    			set_attributes(input_1, input_1_data);
    			toggle_class(input_1, "svelte-17l1npl", true);
    			add_location(input_1, file$e, 899, 4, 24419);
    			attr_dev(div, "class", div_class_value = "selectContainer " + /*containerClasses*/ ctx[21] + " svelte-17l1npl");
    			attr_dev(div, "style", /*containerStyles*/ ctx[11]);
    			toggle_class(div, "hasError", /*hasError*/ ctx[10]);
    			toggle_class(div, "multiSelect", /*isMulti*/ ctx[7]);
    			toggle_class(div, "disabled", /*isDisabled*/ ctx[9]);
    			toggle_class(div, "focused", /*isFocused*/ ctx[1]);
    			add_location(div, file$e, 861, 0, 23429);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			if (if_block0) if_block0.m(span, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			append_dev(div, input_1);
    			if (input_1.autofocus) input_1.focus();
    			/*input_1_binding*/ ctx[82](input_1);
    			set_input_value(input_1, /*filterText*/ ctx[3]);
    			append_dev(div, t3);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t4);
    			if (if_block4) if_block4.m(div, null);
    			append_dev(div, t5);
    			if (if_block5) if_block5.m(div, null);
    			append_dev(div, t6);
    			if (if_block6) if_block6.m(div, null);
    			append_dev(div, t7);
    			if (if_block7) if_block7.m(div, null);
    			append_dev(div, t8);
    			if (if_block8) if_block8.m(div, null);
    			append_dev(div, t9);
    			if (if_block9) if_block9.m(div, null);
    			/*div_binding*/ ctx[85](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "click", /*handleWindowEvent*/ ctx[41], false, false, false),
    					listen_dev(window, "focusin", /*handleWindowEvent*/ ctx[41], false, false, false),
    					listen_dev(window, "keydown", /*handleKeyDown*/ ctx[39], false, false, false),
    					listen_dev(input_1, "focus", /*handleFocus*/ ctx[40], false, false, false),
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[83]),
    					listen_dev(div, "click", /*handleClick*/ ctx[42], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*isFocused*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					if_block0.m(span, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*Icon*/ ctx[17]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*Icon*/ 131072) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_9(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*showMultiSelect*/ ctx[35]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[1] & /*showMultiSelect*/ 16) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_8(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			set_attributes(input_1, input_1_data = get_spread_update(input_1_levels, [
    				(!current || dirty[0] & /*isSearchable*/ 8192 && input_1_readonly_value !== (input_1_readonly_value = !/*isSearchable*/ ctx[13])) && { readOnly: input_1_readonly_value },
    				dirty[1] & /*_inputAttributes*/ 1 && /*_inputAttributes*/ ctx[31],
    				(!current || dirty[1] & /*placeholderText*/ 32) && { placeholder: /*placeholderText*/ ctx[36] },
    				(!current || dirty[0] & /*inputStyles*/ 16384) && { style: /*inputStyles*/ ctx[14] },
    				(!current || dirty[0] & /*isDisabled*/ 512) && { disabled: /*isDisabled*/ ctx[9] }
    			]));

    			if (dirty[0] & /*filterText*/ 8 && input_1.value !== /*filterText*/ ctx[3]) {
    				set_input_value(input_1, /*filterText*/ ctx[3]);
    			}

    			toggle_class(input_1, "svelte-17l1npl", true);

    			if (!/*isMulti*/ ctx[7] && /*showSelectedItem*/ ctx[29]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*isMulti, showSelectedItem*/ 536871040) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_7(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div, t4);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*showClearIcon*/ ctx[37]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty[1] & /*showClearIcon*/ 64) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_6(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div, t5);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (!/*showClearIcon*/ ctx[37] && (/*showIndicator*/ ctx[20] || /*showChevron*/ ctx[19] && !/*value*/ ctx[2] || !/*isSearchable*/ ctx[13] && !/*isDisabled*/ ctx[9] && !/*isWaiting*/ ctx[4] && (/*showSelectedItem*/ ctx[29] && !/*isClearable*/ ctx[15] || !/*showSelectedItem*/ ctx[29]))) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_4(ctx);
    					if_block5.c();
    					if_block5.m(div, t6);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*isWaiting*/ ctx[4]) {
    				if (if_block6) ; else {
    					if_block6 = create_if_block_3(ctx);
    					if_block6.c();
    					if_block6.m(div, t7);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*listOpen*/ ctx[5]) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);

    					if (dirty[0] & /*listOpen*/ 32) {
    						transition_in(if_block7, 1);
    					}
    				} else {
    					if_block7 = create_if_block_2(ctx);
    					if_block7.c();
    					transition_in(if_block7, 1);
    					if_block7.m(div, t8);
    				}
    			} else if (if_block7) {
    				group_outros();

    				transition_out(if_block7, 1, 1, () => {
    					if_block7 = null;
    				});

    				check_outros();
    			}

    			if (!/*isMulti*/ ctx[7] || /*isMulti*/ ctx[7] && !/*showMultiSelect*/ ctx[35]) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_1$1(ctx);
    					if_block8.c();
    					if_block8.m(div, t9);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*isMulti*/ ctx[7] && /*showMultiSelect*/ ctx[35]) {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block$3(ctx);
    					if_block9.c();
    					if_block9.m(div, null);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (!current || dirty[0] & /*containerClasses*/ 2097152 && div_class_value !== (div_class_value = "selectContainer " + /*containerClasses*/ ctx[21] + " svelte-17l1npl")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty[0] & /*containerStyles*/ 2048) {
    				attr_dev(div, "style", /*containerStyles*/ ctx[11]);
    			}

    			if (!current || dirty[0] & /*containerClasses, hasError*/ 2098176) {
    				toggle_class(div, "hasError", /*hasError*/ ctx[10]);
    			}

    			if (!current || dirty[0] & /*containerClasses, isMulti*/ 2097280) {
    				toggle_class(div, "multiSelect", /*isMulti*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*containerClasses, isDisabled*/ 2097664) {
    				toggle_class(div, "disabled", /*isDisabled*/ ctx[9]);
    			}

    			if (!current || dirty[0] & /*containerClasses, isFocused*/ 2097154) {
    				toggle_class(div, "focused", /*isFocused*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block7);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block7);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			/*input_1_binding*/ ctx[82](null);
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			/*div_binding*/ ctx[85](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function convertStringItemsToObjects(_items) {
    	return _items.map((item, index) => {
    		return { index, value: item, label: `${item}` };
    	});
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let filteredItems;
    	let showSelectedItem;
    	let showClearIcon;
    	let placeholderText;
    	let showMultiSelect;
    	let listProps;
    	let ariaSelection;
    	let ariaContext;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Select', slots, []);
    	const dispatch = createEventDispatcher();
    	let { id = null } = $$props;
    	let { container = undefined } = $$props;
    	let { input = undefined } = $$props;
    	let { isMulti = false } = $$props;
    	let { multiFullItemClearable = false } = $$props;
    	let { isDisabled = false } = $$props;
    	let { isCreatable = false } = $$props;
    	let { isFocused = false } = $$props;
    	let { value = null } = $$props;
    	let { filterText = '' } = $$props;
    	let { placeholder = 'Select...' } = $$props;
    	let { placeholderAlwaysShow = false } = $$props;
    	let { items = null } = $$props;
    	let { itemFilter = (label, filterText, option) => `${label}`.toLowerCase().includes(filterText.toLowerCase()) } = $$props;
    	let { groupBy = undefined } = $$props;
    	let { groupFilter = groups => groups } = $$props;
    	let { isGroupHeaderSelectable = false } = $$props;

    	let { getGroupHeaderLabel = option => {
    		return option[labelIdentifier] || option.id;
    	} } = $$props;

    	let { labelIdentifier = 'label' } = $$props;

    	let { getOptionLabel = (option, filterText) => {
    		return option.isCreator
    		? `Create \"${filterText}\"`
    		: option[labelIdentifier];
    	} } = $$props;

    	let { optionIdentifier = 'value' } = $$props;
    	let { loadOptions = undefined } = $$props;
    	let { hasError = false } = $$props;
    	let { containerStyles = '' } = $$props;

    	let { getSelectionLabel = option => {
    		if (option) return option[labelIdentifier]; else return null;
    	} } = $$props;

    	let { createGroupHeaderItem = groupValue => {
    		return { value: groupValue, label: groupValue };
    	} } = $$props;

    	let { createItem = filterText => {
    		return { value: filterText, label: filterText };
    	} } = $$props;

    	const getFilteredItems = () => {
    		return filteredItems;
    	};

    	let { isSearchable = true } = $$props;
    	let { inputStyles = '' } = $$props;
    	let { isClearable = true } = $$props;
    	let { isWaiting = false } = $$props;
    	let { listPlacement = 'auto' } = $$props;
    	let { listOpen = false } = $$props;
    	let { isVirtualList = false } = $$props;
    	let { loadOptionsInterval = 300 } = $$props;
    	let { noOptionsMessage = 'No options' } = $$props;
    	let { hideEmptyState = false } = $$props;
    	let { inputAttributes = {} } = $$props;
    	let { listAutoWidth = true } = $$props;
    	let { itemHeight = 40 } = $$props;
    	let { Icon = undefined } = $$props;
    	let { iconProps = {} } = $$props;
    	let { showChevron = false } = $$props;
    	let { showIndicator = false } = $$props;
    	let { containerClasses = '' } = $$props;
    	let { indicatorSvg = undefined } = $$props;
    	let { listOffset = 5 } = $$props;
    	let { ClearIcon: ClearIcon$1 = ClearIcon } = $$props;
    	let { Item: Item$1 = Item } = $$props;
    	let { List: List$1 = List } = $$props;
    	let { Selection: Selection$1 = Selection } = $$props;
    	let { MultiSelection: MultiSelection$1 = MultiSelection } = $$props;
    	let { VirtualList: VirtualList$1 = VirtualList } = $$props;

    	function filterMethod(args) {
    		if (args.loadOptions && args.filterText.length > 0) return;
    		if (!args.items) return [];

    		if (args.items && args.items.length > 0 && typeof args.items[0] !== 'object') {
    			args.items = convertStringItemsToObjects(args.items);
    		}

    		let filterResults = args.items.filter(item => {
    			let matchesFilter = itemFilter(getOptionLabel(item, args.filterText), args.filterText, item);

    			if (matchesFilter && args.isMulti && args.value && Array.isArray(args.value)) {
    				matchesFilter = !args.value.some(x => {
    					return x[args.optionIdentifier] === item[args.optionIdentifier];
    				});
    			}

    			return matchesFilter;
    		});

    		if (args.groupBy) {
    			filterResults = filterGroupedItems(filterResults);
    		}

    		if (args.isCreatable) {
    			filterResults = addCreatableItem(filterResults, args.filterText);
    		}

    		return filterResults;
    	}

    	function addCreatableItem(_items, _filterText) {
    		if (_filterText.length === 0) return _items;
    		const itemToCreate = createItem(_filterText);
    		if (_items[0] && _filterText === _items[0][labelIdentifier]) return _items;
    		itemToCreate.isCreator = true;
    		return [..._items, itemToCreate];
    	}

    	let { selectedValue = null } = $$props;
    	let activeValue;
    	let prev_value;
    	let prev_filterText;
    	let prev_isFocused;
    	let prev_isMulti;
    	let hoverItemIndex;

    	const getItems = debounce(
    		async () => {
    			$$invalidate(4, isWaiting = true);

    			let res = await loadOptions(filterText).catch(err => {
    				console.warn('svelte-select loadOptions error :>> ', err);
    				dispatch('error', { type: 'loadOptions', details: err });
    			});

    			if (res && !res.cancelled) {
    				if (res) {
    					if (res && res.length > 0 && typeof res[0] !== 'object') {
    						res = convertStringItemsToObjects(res);
    					}

    					$$invalidate(81, filteredItems = [...res]);
    					dispatch('loaded', { items: filteredItems });
    				} else {
    					$$invalidate(81, filteredItems = []);
    				}

    				if (isCreatable) {
    					$$invalidate(81, filteredItems = addCreatableItem(filteredItems, filterText));
    				}

    				$$invalidate(4, isWaiting = false);
    				$$invalidate(1, isFocused = true);
    				$$invalidate(5, listOpen = true);
    			}
    		},
    		loadOptionsInterval
    	);

    	function setValue() {
    		if (typeof value === 'string') {
    			$$invalidate(2, value = { [optionIdentifier]: value, label: value });
    		} else if (isMulti && Array.isArray(value) && value.length > 0) {
    			$$invalidate(2, value = value.map(item => typeof item === 'string'
    			? { value: item, label: item }
    			: item));
    		}
    	}

    	let _inputAttributes;

    	function assignInputAttributes() {
    		$$invalidate(31, _inputAttributes = Object.assign(
    			{
    				autocapitalize: 'none',
    				autocomplete: 'off',
    				autocorrect: 'off',
    				spellcheck: false,
    				tabindex: 0,
    				type: 'text',
    				'aria-autocomplete': 'list'
    			},
    			inputAttributes
    		));

    		if (id) {
    			$$invalidate(31, _inputAttributes.id = id, _inputAttributes);
    		}

    		if (!isSearchable) {
    			$$invalidate(31, _inputAttributes.readonly = true, _inputAttributes);
    		}
    	}

    	function filterGroupedItems(_items) {
    		const groupValues = [];
    		const groups = {};

    		_items.forEach(item => {
    			const groupValue = groupBy(item);

    			if (!groupValues.includes(groupValue)) {
    				groupValues.push(groupValue);
    				groups[groupValue] = [];

    				if (groupValue) {
    					groups[groupValue].push(Object.assign(createGroupHeaderItem(groupValue, item), {
    						id: groupValue,
    						isGroupHeader: true,
    						isSelectable: isGroupHeaderSelectable
    					}));
    				}
    			}

    			groups[groupValue].push(Object.assign({ isGroupItem: !!groupValue }, item));
    		});

    		const sortedGroupedItems = [];

    		groupFilter(groupValues).forEach(groupValue => {
    			sortedGroupedItems.push(...groups[groupValue]);
    		});

    		return sortedGroupedItems;
    	}

    	function dispatchSelectedItem() {
    		if (isMulti) {
    			if (JSON.stringify(value) !== JSON.stringify(prev_value)) {
    				if (checkValueForDuplicates()) {
    					dispatch('select', value);
    				}
    			}

    			return;
    		}

    		if (!prev_value || JSON.stringify(value[optionIdentifier]) !== JSON.stringify(prev_value[optionIdentifier])) {
    			dispatch('select', value);
    		}
    	}

    	function setupFocus() {
    		if (isFocused || listOpen) {
    			handleFocus();
    		} else {
    			if (input) input.blur();
    		}
    	}

    	function setupMulti() {
    		if (value) {
    			if (Array.isArray(value)) {
    				$$invalidate(2, value = [...value]);
    			} else {
    				$$invalidate(2, value = [value]);
    			}
    		}
    	}

    	function setupSingle() {
    		if (value) $$invalidate(2, value = null);
    	}

    	function setupFilterText() {
    		if (filterText.length === 0) return;
    		$$invalidate(1, isFocused = true);
    		$$invalidate(5, listOpen = true);

    		if (loadOptions) {
    			getItems();
    		} else {
    			$$invalidate(5, listOpen = true);

    			if (isMulti) {
    				$$invalidate(30, activeValue = undefined);
    			}
    		}
    	}

    	beforeUpdate(async () => {
    		$$invalidate(77, prev_value = value);
    		$$invalidate(78, prev_filterText = filterText);
    		$$invalidate(79, prev_isFocused = isFocused);
    		$$invalidate(80, prev_isMulti = isMulti);
    	});

    	function checkValueForDuplicates() {
    		let noDuplicates = true;

    		if (value) {
    			const ids = [];
    			const uniqueValues = [];

    			value.forEach(val => {
    				if (!ids.includes(val[optionIdentifier])) {
    					ids.push(val[optionIdentifier]);
    					uniqueValues.push(val);
    				} else {
    					noDuplicates = false;
    				}
    			});

    			if (!noDuplicates) $$invalidate(2, value = uniqueValues);
    		}

    		return noDuplicates;
    	}

    	function findItem(selection) {
    		let matchTo = selection
    		? selection[optionIdentifier]
    		: value[optionIdentifier];

    		return items.find(item => item[optionIdentifier] === matchTo);
    	}

    	function updateValueDisplay(items) {
    		if (!items || items.length === 0 || items.some(item => typeof item !== 'object')) return;

    		if (!value || (isMulti
    		? value.some(selection => !selection || !selection[optionIdentifier])
    		: !value[optionIdentifier])) return;

    		if (Array.isArray(value)) {
    			$$invalidate(2, value = value.map(selection => findItem(selection) || selection));
    		} else {
    			$$invalidate(2, value = findItem() || value);
    		}
    	}

    	function handleMultiItemClear(event) {
    		const { detail } = event;
    		const itemToRemove = value[detail ? detail.i : value.length - 1];

    		if (value.length === 1) {
    			$$invalidate(2, value = undefined);
    		} else {
    			$$invalidate(2, value = value.filter(item => {
    				return item !== itemToRemove;
    			}));
    		}

    		dispatch('clear', itemToRemove);
    	}

    	function handleKeyDown(e) {
    		if (!isFocused) return;

    		switch (e.key) {
    			case 'ArrowDown':
    				e.preventDefault();
    				$$invalidate(5, listOpen = true);
    				$$invalidate(30, activeValue = undefined);
    				break;
    			case 'ArrowUp':
    				e.preventDefault();
    				$$invalidate(5, listOpen = true);
    				$$invalidate(30, activeValue = undefined);
    				break;
    			case 'Tab':
    				if (!listOpen) $$invalidate(1, isFocused = false);
    				break;
    			case 'Backspace':
    				if (!isMulti || filterText.length > 0) return;
    				if (isMulti && value && value.length > 0) {
    					handleMultiItemClear(activeValue !== undefined
    					? activeValue
    					: value.length - 1);

    					if (activeValue === 0 || activeValue === undefined) break;
    					$$invalidate(30, activeValue = value.length > activeValue ? activeValue - 1 : undefined);
    				}
    				break;
    			case 'ArrowLeft':
    				if (!isMulti || filterText.length > 0) return;
    				if (activeValue === undefined) {
    					$$invalidate(30, activeValue = value.length - 1);
    				} else if (value.length > activeValue && activeValue !== 0) {
    					$$invalidate(30, activeValue -= 1);
    				}
    				break;
    			case 'ArrowRight':
    				if (!isMulti || filterText.length > 0 || activeValue === undefined) return;
    				if (activeValue === value.length - 1) {
    					$$invalidate(30, activeValue = undefined);
    				} else if (activeValue < value.length - 1) {
    					$$invalidate(30, activeValue += 1);
    				}
    				break;
    		}
    	}

    	function handleFocus() {
    		$$invalidate(1, isFocused = true);
    		if (input) input.focus();
    	}

    	function handleWindowEvent(event) {
    		if (!container) return;

    		const eventTarget = event.path && event.path.length > 0
    		? event.path[0]
    		: event.target;

    		if (container.contains(eventTarget) || container.contains(event.relatedTarget)) {
    			return;
    		}

    		$$invalidate(1, isFocused = false);
    		$$invalidate(5, listOpen = false);
    		$$invalidate(30, activeValue = undefined);
    		if (input) input.blur();
    	}

    	function handleClick() {
    		if (isDisabled) return;
    		$$invalidate(1, isFocused = true);
    		$$invalidate(5, listOpen = !listOpen);
    	}

    	function handleClear() {
    		$$invalidate(2, value = undefined);
    		$$invalidate(5, listOpen = false);
    		dispatch('clear', value);
    		handleFocus();
    	}

    	onMount(() => {
    		if (isFocused && input) input.focus();
    	});

    	function itemSelected(event) {
    		const { detail } = event;

    		if (detail) {
    			$$invalidate(3, filterText = '');
    			const item = Object.assign({}, detail);

    			if (!item.isGroupHeader || item.isSelectable) {
    				if (isMulti) {
    					$$invalidate(2, value = value ? value.concat([item]) : [item]);
    				} else {
    					$$invalidate(2, value = item);
    				}

    				$$invalidate(2, value);

    				setTimeout(() => {
    					$$invalidate(5, listOpen = false);
    					$$invalidate(30, activeValue = undefined);
    				});
    			}
    		}
    	}

    	function itemCreated(event) {
    		const { detail } = event;

    		if (isMulti) {
    			$$invalidate(2, value = value || []);
    			$$invalidate(2, value = [...value, createItem(detail)]);
    		} else {
    			$$invalidate(2, value = createItem(detail));
    		}

    		dispatch('itemCreated', detail);
    		$$invalidate(3, filterText = '');
    		$$invalidate(5, listOpen = false);
    		$$invalidate(30, activeValue = undefined);
    	}

    	function closeList() {
    		$$invalidate(3, filterText = '');
    		$$invalidate(5, listOpen = false);
    	}

    	let { ariaValues = values => {
    		return `Option ${values}, selected.`;
    	} } = $$props;

    	let { ariaListOpen = (label, count) => {
    		return `You are currently focused on option ${label}. There are ${count} results available.`;
    	} } = $$props;

    	let { ariaFocused = () => {
    		return `Select is focused, type to refine list, press down to open the menu.`;
    	} } = $$props;

    	function handleAriaSelection() {
    		let selected = undefined;

    		if (isMulti && value.length > 0) {
    			selected = value.map(v => getSelectionLabel(v)).join(', ');
    		} else {
    			selected = getSelectionLabel(value);
    		}

    		return ariaValues(selected);
    	}

    	function handleAriaContent() {
    		if (!isFocused || !filteredItems || filteredItems.length === 0) return '';
    		let _item = filteredItems[hoverItemIndex];

    		if (listOpen && _item) {
    			let label = getSelectionLabel(_item);
    			let count = filteredItems ? filteredItems.length : 0;
    			return ariaListOpen(label, count);
    		} else {
    			return ariaFocused();
    		}
    	}

    	const writable_props = [
    		'id',
    		'container',
    		'input',
    		'isMulti',
    		'multiFullItemClearable',
    		'isDisabled',
    		'isCreatable',
    		'isFocused',
    		'value',
    		'filterText',
    		'placeholder',
    		'placeholderAlwaysShow',
    		'items',
    		'itemFilter',
    		'groupBy',
    		'groupFilter',
    		'isGroupHeaderSelectable',
    		'getGroupHeaderLabel',
    		'labelIdentifier',
    		'getOptionLabel',
    		'optionIdentifier',
    		'loadOptions',
    		'hasError',
    		'containerStyles',
    		'getSelectionLabel',
    		'createGroupHeaderItem',
    		'createItem',
    		'isSearchable',
    		'inputStyles',
    		'isClearable',
    		'isWaiting',
    		'listPlacement',
    		'listOpen',
    		'isVirtualList',
    		'loadOptionsInterval',
    		'noOptionsMessage',
    		'hideEmptyState',
    		'inputAttributes',
    		'listAutoWidth',
    		'itemHeight',
    		'Icon',
    		'iconProps',
    		'showChevron',
    		'showIndicator',
    		'containerClasses',
    		'indicatorSvg',
    		'listOffset',
    		'ClearIcon',
    		'Item',
    		'List',
    		'Selection',
    		'MultiSelection',
    		'VirtualList',
    		'selectedValue',
    		'ariaValues',
    		'ariaListOpen',
    		'ariaFocused'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Select> was created with unknown prop '${key}'`);
    	});

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(6, input);
    		});
    	}

    	function input_1_input_handler() {
    		filterText = this.value;
    		$$invalidate(3, filterText);
    	}

    	function switch_instance_hoverItemIndex_binding(value) {
    		hoverItemIndex = value;
    		$$invalidate(28, hoverItemIndex);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(46, id = $$props.id);
    		if ('container' in $$props) $$invalidate(0, container = $$props.container);
    		if ('input' in $$props) $$invalidate(6, input = $$props.input);
    		if ('isMulti' in $$props) $$invalidate(7, isMulti = $$props.isMulti);
    		if ('multiFullItemClearable' in $$props) $$invalidate(8, multiFullItemClearable = $$props.multiFullItemClearable);
    		if ('isDisabled' in $$props) $$invalidate(9, isDisabled = $$props.isDisabled);
    		if ('isCreatable' in $$props) $$invalidate(47, isCreatable = $$props.isCreatable);
    		if ('isFocused' in $$props) $$invalidate(1, isFocused = $$props.isFocused);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('filterText' in $$props) $$invalidate(3, filterText = $$props.filterText);
    		if ('placeholder' in $$props) $$invalidate(48, placeholder = $$props.placeholder);
    		if ('placeholderAlwaysShow' in $$props) $$invalidate(49, placeholderAlwaysShow = $$props.placeholderAlwaysShow);
    		if ('items' in $$props) $$invalidate(50, items = $$props.items);
    		if ('itemFilter' in $$props) $$invalidate(51, itemFilter = $$props.itemFilter);
    		if ('groupBy' in $$props) $$invalidate(52, groupBy = $$props.groupBy);
    		if ('groupFilter' in $$props) $$invalidate(53, groupFilter = $$props.groupFilter);
    		if ('isGroupHeaderSelectable' in $$props) $$invalidate(54, isGroupHeaderSelectable = $$props.isGroupHeaderSelectable);
    		if ('getGroupHeaderLabel' in $$props) $$invalidate(55, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
    		if ('labelIdentifier' in $$props) $$invalidate(56, labelIdentifier = $$props.labelIdentifier);
    		if ('getOptionLabel' in $$props) $$invalidate(57, getOptionLabel = $$props.getOptionLabel);
    		if ('optionIdentifier' in $$props) $$invalidate(58, optionIdentifier = $$props.optionIdentifier);
    		if ('loadOptions' in $$props) $$invalidate(59, loadOptions = $$props.loadOptions);
    		if ('hasError' in $$props) $$invalidate(10, hasError = $$props.hasError);
    		if ('containerStyles' in $$props) $$invalidate(11, containerStyles = $$props.containerStyles);
    		if ('getSelectionLabel' in $$props) $$invalidate(12, getSelectionLabel = $$props.getSelectionLabel);
    		if ('createGroupHeaderItem' in $$props) $$invalidate(60, createGroupHeaderItem = $$props.createGroupHeaderItem);
    		if ('createItem' in $$props) $$invalidate(61, createItem = $$props.createItem);
    		if ('isSearchable' in $$props) $$invalidate(13, isSearchable = $$props.isSearchable);
    		if ('inputStyles' in $$props) $$invalidate(14, inputStyles = $$props.inputStyles);
    		if ('isClearable' in $$props) $$invalidate(15, isClearable = $$props.isClearable);
    		if ('isWaiting' in $$props) $$invalidate(4, isWaiting = $$props.isWaiting);
    		if ('listPlacement' in $$props) $$invalidate(63, listPlacement = $$props.listPlacement);
    		if ('listOpen' in $$props) $$invalidate(5, listOpen = $$props.listOpen);
    		if ('isVirtualList' in $$props) $$invalidate(64, isVirtualList = $$props.isVirtualList);
    		if ('loadOptionsInterval' in $$props) $$invalidate(65, loadOptionsInterval = $$props.loadOptionsInterval);
    		if ('noOptionsMessage' in $$props) $$invalidate(66, noOptionsMessage = $$props.noOptionsMessage);
    		if ('hideEmptyState' in $$props) $$invalidate(67, hideEmptyState = $$props.hideEmptyState);
    		if ('inputAttributes' in $$props) $$invalidate(16, inputAttributes = $$props.inputAttributes);
    		if ('listAutoWidth' in $$props) $$invalidate(68, listAutoWidth = $$props.listAutoWidth);
    		if ('itemHeight' in $$props) $$invalidate(69, itemHeight = $$props.itemHeight);
    		if ('Icon' in $$props) $$invalidate(17, Icon = $$props.Icon);
    		if ('iconProps' in $$props) $$invalidate(18, iconProps = $$props.iconProps);
    		if ('showChevron' in $$props) $$invalidate(19, showChevron = $$props.showChevron);
    		if ('showIndicator' in $$props) $$invalidate(20, showIndicator = $$props.showIndicator);
    		if ('containerClasses' in $$props) $$invalidate(21, containerClasses = $$props.containerClasses);
    		if ('indicatorSvg' in $$props) $$invalidate(22, indicatorSvg = $$props.indicatorSvg);
    		if ('listOffset' in $$props) $$invalidate(70, listOffset = $$props.listOffset);
    		if ('ClearIcon' in $$props) $$invalidate(23, ClearIcon$1 = $$props.ClearIcon);
    		if ('Item' in $$props) $$invalidate(71, Item$1 = $$props.Item);
    		if ('List' in $$props) $$invalidate(24, List$1 = $$props.List);
    		if ('Selection' in $$props) $$invalidate(25, Selection$1 = $$props.Selection);
    		if ('MultiSelection' in $$props) $$invalidate(26, MultiSelection$1 = $$props.MultiSelection);
    		if ('VirtualList' in $$props) $$invalidate(72, VirtualList$1 = $$props.VirtualList);
    		if ('selectedValue' in $$props) $$invalidate(73, selectedValue = $$props.selectedValue);
    		if ('ariaValues' in $$props) $$invalidate(74, ariaValues = $$props.ariaValues);
    		if ('ariaListOpen' in $$props) $$invalidate(75, ariaListOpen = $$props.ariaListOpen);
    		if ('ariaFocused' in $$props) $$invalidate(76, ariaFocused = $$props.ariaFocused);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		createEventDispatcher,
    		onMount,
    		_List: List,
    		_Item: Item,
    		_Selection: Selection,
    		_MultiSelection: MultiSelection,
    		_VirtualList: VirtualList,
    		_ClearIcon: ClearIcon,
    		debounce,
    		dispatch,
    		id,
    		container,
    		input,
    		isMulti,
    		multiFullItemClearable,
    		isDisabled,
    		isCreatable,
    		isFocused,
    		value,
    		filterText,
    		placeholder,
    		placeholderAlwaysShow,
    		items,
    		itemFilter,
    		groupBy,
    		groupFilter,
    		isGroupHeaderSelectable,
    		getGroupHeaderLabel,
    		labelIdentifier,
    		getOptionLabel,
    		optionIdentifier,
    		loadOptions,
    		hasError,
    		containerStyles,
    		getSelectionLabel,
    		createGroupHeaderItem,
    		createItem,
    		getFilteredItems,
    		isSearchable,
    		inputStyles,
    		isClearable,
    		isWaiting,
    		listPlacement,
    		listOpen,
    		isVirtualList,
    		loadOptionsInterval,
    		noOptionsMessage,
    		hideEmptyState,
    		inputAttributes,
    		listAutoWidth,
    		itemHeight,
    		Icon,
    		iconProps,
    		showChevron,
    		showIndicator,
    		containerClasses,
    		indicatorSvg,
    		listOffset,
    		ClearIcon: ClearIcon$1,
    		Item: Item$1,
    		List: List$1,
    		Selection: Selection$1,
    		MultiSelection: MultiSelection$1,
    		VirtualList: VirtualList$1,
    		filterMethod,
    		addCreatableItem,
    		selectedValue,
    		activeValue,
    		prev_value,
    		prev_filterText,
    		prev_isFocused,
    		prev_isMulti,
    		hoverItemIndex,
    		getItems,
    		setValue,
    		_inputAttributes,
    		assignInputAttributes,
    		convertStringItemsToObjects,
    		filterGroupedItems,
    		dispatchSelectedItem,
    		setupFocus,
    		setupMulti,
    		setupSingle,
    		setupFilterText,
    		checkValueForDuplicates,
    		findItem,
    		updateValueDisplay,
    		handleMultiItemClear,
    		handleKeyDown,
    		handleFocus,
    		handleWindowEvent,
    		handleClick,
    		handleClear,
    		itemSelected,
    		itemCreated,
    		closeList,
    		ariaValues,
    		ariaListOpen,
    		ariaFocused,
    		handleAriaSelection,
    		handleAriaContent,
    		filteredItems,
    		ariaContext,
    		ariaSelection,
    		listProps,
    		showMultiSelect,
    		placeholderText,
    		showSelectedItem,
    		showClearIcon
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(46, id = $$props.id);
    		if ('container' in $$props) $$invalidate(0, container = $$props.container);
    		if ('input' in $$props) $$invalidate(6, input = $$props.input);
    		if ('isMulti' in $$props) $$invalidate(7, isMulti = $$props.isMulti);
    		if ('multiFullItemClearable' in $$props) $$invalidate(8, multiFullItemClearable = $$props.multiFullItemClearable);
    		if ('isDisabled' in $$props) $$invalidate(9, isDisabled = $$props.isDisabled);
    		if ('isCreatable' in $$props) $$invalidate(47, isCreatable = $$props.isCreatable);
    		if ('isFocused' in $$props) $$invalidate(1, isFocused = $$props.isFocused);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('filterText' in $$props) $$invalidate(3, filterText = $$props.filterText);
    		if ('placeholder' in $$props) $$invalidate(48, placeholder = $$props.placeholder);
    		if ('placeholderAlwaysShow' in $$props) $$invalidate(49, placeholderAlwaysShow = $$props.placeholderAlwaysShow);
    		if ('items' in $$props) $$invalidate(50, items = $$props.items);
    		if ('itemFilter' in $$props) $$invalidate(51, itemFilter = $$props.itemFilter);
    		if ('groupBy' in $$props) $$invalidate(52, groupBy = $$props.groupBy);
    		if ('groupFilter' in $$props) $$invalidate(53, groupFilter = $$props.groupFilter);
    		if ('isGroupHeaderSelectable' in $$props) $$invalidate(54, isGroupHeaderSelectable = $$props.isGroupHeaderSelectable);
    		if ('getGroupHeaderLabel' in $$props) $$invalidate(55, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
    		if ('labelIdentifier' in $$props) $$invalidate(56, labelIdentifier = $$props.labelIdentifier);
    		if ('getOptionLabel' in $$props) $$invalidate(57, getOptionLabel = $$props.getOptionLabel);
    		if ('optionIdentifier' in $$props) $$invalidate(58, optionIdentifier = $$props.optionIdentifier);
    		if ('loadOptions' in $$props) $$invalidate(59, loadOptions = $$props.loadOptions);
    		if ('hasError' in $$props) $$invalidate(10, hasError = $$props.hasError);
    		if ('containerStyles' in $$props) $$invalidate(11, containerStyles = $$props.containerStyles);
    		if ('getSelectionLabel' in $$props) $$invalidate(12, getSelectionLabel = $$props.getSelectionLabel);
    		if ('createGroupHeaderItem' in $$props) $$invalidate(60, createGroupHeaderItem = $$props.createGroupHeaderItem);
    		if ('createItem' in $$props) $$invalidate(61, createItem = $$props.createItem);
    		if ('isSearchable' in $$props) $$invalidate(13, isSearchable = $$props.isSearchable);
    		if ('inputStyles' in $$props) $$invalidate(14, inputStyles = $$props.inputStyles);
    		if ('isClearable' in $$props) $$invalidate(15, isClearable = $$props.isClearable);
    		if ('isWaiting' in $$props) $$invalidate(4, isWaiting = $$props.isWaiting);
    		if ('listPlacement' in $$props) $$invalidate(63, listPlacement = $$props.listPlacement);
    		if ('listOpen' in $$props) $$invalidate(5, listOpen = $$props.listOpen);
    		if ('isVirtualList' in $$props) $$invalidate(64, isVirtualList = $$props.isVirtualList);
    		if ('loadOptionsInterval' in $$props) $$invalidate(65, loadOptionsInterval = $$props.loadOptionsInterval);
    		if ('noOptionsMessage' in $$props) $$invalidate(66, noOptionsMessage = $$props.noOptionsMessage);
    		if ('hideEmptyState' in $$props) $$invalidate(67, hideEmptyState = $$props.hideEmptyState);
    		if ('inputAttributes' in $$props) $$invalidate(16, inputAttributes = $$props.inputAttributes);
    		if ('listAutoWidth' in $$props) $$invalidate(68, listAutoWidth = $$props.listAutoWidth);
    		if ('itemHeight' in $$props) $$invalidate(69, itemHeight = $$props.itemHeight);
    		if ('Icon' in $$props) $$invalidate(17, Icon = $$props.Icon);
    		if ('iconProps' in $$props) $$invalidate(18, iconProps = $$props.iconProps);
    		if ('showChevron' in $$props) $$invalidate(19, showChevron = $$props.showChevron);
    		if ('showIndicator' in $$props) $$invalidate(20, showIndicator = $$props.showIndicator);
    		if ('containerClasses' in $$props) $$invalidate(21, containerClasses = $$props.containerClasses);
    		if ('indicatorSvg' in $$props) $$invalidate(22, indicatorSvg = $$props.indicatorSvg);
    		if ('listOffset' in $$props) $$invalidate(70, listOffset = $$props.listOffset);
    		if ('ClearIcon' in $$props) $$invalidate(23, ClearIcon$1 = $$props.ClearIcon);
    		if ('Item' in $$props) $$invalidate(71, Item$1 = $$props.Item);
    		if ('List' in $$props) $$invalidate(24, List$1 = $$props.List);
    		if ('Selection' in $$props) $$invalidate(25, Selection$1 = $$props.Selection);
    		if ('MultiSelection' in $$props) $$invalidate(26, MultiSelection$1 = $$props.MultiSelection);
    		if ('VirtualList' in $$props) $$invalidate(72, VirtualList$1 = $$props.VirtualList);
    		if ('selectedValue' in $$props) $$invalidate(73, selectedValue = $$props.selectedValue);
    		if ('activeValue' in $$props) $$invalidate(30, activeValue = $$props.activeValue);
    		if ('prev_value' in $$props) $$invalidate(77, prev_value = $$props.prev_value);
    		if ('prev_filterText' in $$props) $$invalidate(78, prev_filterText = $$props.prev_filterText);
    		if ('prev_isFocused' in $$props) $$invalidate(79, prev_isFocused = $$props.prev_isFocused);
    		if ('prev_isMulti' in $$props) $$invalidate(80, prev_isMulti = $$props.prev_isMulti);
    		if ('hoverItemIndex' in $$props) $$invalidate(28, hoverItemIndex = $$props.hoverItemIndex);
    		if ('_inputAttributes' in $$props) $$invalidate(31, _inputAttributes = $$props._inputAttributes);
    		if ('ariaValues' in $$props) $$invalidate(74, ariaValues = $$props.ariaValues);
    		if ('ariaListOpen' in $$props) $$invalidate(75, ariaListOpen = $$props.ariaListOpen);
    		if ('ariaFocused' in $$props) $$invalidate(76, ariaFocused = $$props.ariaFocused);
    		if ('filteredItems' in $$props) $$invalidate(81, filteredItems = $$props.filteredItems);
    		if ('ariaContext' in $$props) $$invalidate(32, ariaContext = $$props.ariaContext);
    		if ('ariaSelection' in $$props) $$invalidate(33, ariaSelection = $$props.ariaSelection);
    		if ('listProps' in $$props) $$invalidate(34, listProps = $$props.listProps);
    		if ('showMultiSelect' in $$props) $$invalidate(35, showMultiSelect = $$props.showMultiSelect);
    		if ('placeholderText' in $$props) $$invalidate(36, placeholderText = $$props.placeholderText);
    		if ('showSelectedItem' in $$props) $$invalidate(29, showSelectedItem = $$props.showSelectedItem);
    		if ('showClearIcon' in $$props) $$invalidate(37, showClearIcon = $$props.showClearIcon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*filterText, value, isMulti*/ 140 | $$self.$$.dirty[1] & /*loadOptions, items, optionIdentifier, groupBy, isCreatable*/ 405340160) {
    			$$invalidate(81, filteredItems = filterMethod({
    				loadOptions,
    				filterText,
    				items,
    				value,
    				isMulti,
    				optionIdentifier,
    				groupBy,
    				isCreatable
    			}));
    		}

    		if ($$self.$$.dirty[2] & /*selectedValue*/ 2048) {
    			{
    				if (selectedValue) console.warn('selectedValue is no longer used. Please use value instead.');
    			}
    		}

    		if ($$self.$$.dirty[1] & /*items*/ 524288) {
    			updateValueDisplay(items);
    		}

    		if ($$self.$$.dirty[0] & /*value*/ 4) {
    			{
    				if (value) setValue();
    			}
    		}

    		if ($$self.$$.dirty[0] & /*inputAttributes, isSearchable*/ 73728) {
    			{
    				if (inputAttributes || !isSearchable) assignInputAttributes();
    			}
    		}

    		if ($$self.$$.dirty[0] & /*isMulti*/ 128 | $$self.$$.dirty[2] & /*prev_isMulti*/ 262144) {
    			{
    				if (isMulti) {
    					setupMulti();
    				}

    				if (prev_isMulti && !isMulti) {
    					setupSingle();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*isMulti, value*/ 132) {
    			{
    				if (isMulti && value && value.length > 1) {
    					checkValueForDuplicates();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value*/ 4) {
    			{
    				if (value) dispatchSelectedItem();
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value, isMulti*/ 132 | $$self.$$.dirty[2] & /*prev_value*/ 32768) {
    			{
    				if (!value && isMulti && prev_value) {
    					dispatch('select', value);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*isFocused*/ 2 | $$self.$$.dirty[2] & /*prev_isFocused*/ 131072) {
    			{
    				if (isFocused !== prev_isFocused) {
    					setupFocus();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*filterText*/ 8 | $$self.$$.dirty[2] & /*prev_filterText*/ 65536) {
    			{
    				if (filterText !== prev_filterText) {
    					setupFilterText();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value, filterText*/ 12) {
    			$$invalidate(29, showSelectedItem = value && filterText.length === 0);
    		}

    		if ($$self.$$.dirty[0] & /*showSelectedItem, isClearable, isDisabled, isWaiting*/ 536904208) {
    			$$invalidate(37, showClearIcon = showSelectedItem && isClearable && !isDisabled && !isWaiting);
    		}

    		if ($$self.$$.dirty[0] & /*isMulti, value*/ 132 | $$self.$$.dirty[1] & /*placeholderAlwaysShow, placeholder*/ 393216) {
    			$$invalidate(36, placeholderText = placeholderAlwaysShow && isMulti
    			? placeholder
    			: value ? '' : placeholder);
    		}

    		if ($$self.$$.dirty[0] & /*isMulti, value*/ 132) {
    			$$invalidate(35, showMultiSelect = isMulti && value && value.length > 0);
    		}

    		if ($$self.$$.dirty[0] & /*filterText, value, isMulti, container*/ 141 | $$self.$$.dirty[1] & /*optionIdentifier, getGroupHeaderLabel, getOptionLabel*/ 218103808 | $$self.$$.dirty[2] & /*Item, noOptionsMessage, hideEmptyState, isVirtualList, VirtualList, filteredItems, itemHeight, listPlacement, listAutoWidth, listOffset*/ 526326) {
    			$$invalidate(34, listProps = {
    				Item: Item$1,
    				filterText,
    				optionIdentifier,
    				noOptionsMessage,
    				hideEmptyState,
    				isVirtualList,
    				VirtualList: VirtualList$1,
    				value,
    				isMulti,
    				getGroupHeaderLabel,
    				items: filteredItems,
    				itemHeight,
    				getOptionLabel,
    				listPlacement,
    				parent: container,
    				listAutoWidth,
    				listOffset
    			});
    		}

    		if ($$self.$$.dirty[0] & /*value, isMulti*/ 132) {
    			$$invalidate(33, ariaSelection = value ? handleAriaSelection() : '');
    		}

    		if ($$self.$$.dirty[0] & /*hoverItemIndex, isFocused, listOpen*/ 268435490 | $$self.$$.dirty[2] & /*filteredItems*/ 524288) {
    			$$invalidate(32, ariaContext = handleAriaContent());
    		}
    	};

    	return [
    		container,
    		isFocused,
    		value,
    		filterText,
    		isWaiting,
    		listOpen,
    		input,
    		isMulti,
    		multiFullItemClearable,
    		isDisabled,
    		hasError,
    		containerStyles,
    		getSelectionLabel,
    		isSearchable,
    		inputStyles,
    		isClearable,
    		inputAttributes,
    		Icon,
    		iconProps,
    		showChevron,
    		showIndicator,
    		containerClasses,
    		indicatorSvg,
    		ClearIcon$1,
    		List$1,
    		Selection$1,
    		MultiSelection$1,
    		handleClear,
    		hoverItemIndex,
    		showSelectedItem,
    		activeValue,
    		_inputAttributes,
    		ariaContext,
    		ariaSelection,
    		listProps,
    		showMultiSelect,
    		placeholderText,
    		showClearIcon,
    		handleMultiItemClear,
    		handleKeyDown,
    		handleFocus,
    		handleWindowEvent,
    		handleClick,
    		itemSelected,
    		itemCreated,
    		closeList,
    		id,
    		isCreatable,
    		placeholder,
    		placeholderAlwaysShow,
    		items,
    		itemFilter,
    		groupBy,
    		groupFilter,
    		isGroupHeaderSelectable,
    		getGroupHeaderLabel,
    		labelIdentifier,
    		getOptionLabel,
    		optionIdentifier,
    		loadOptions,
    		createGroupHeaderItem,
    		createItem,
    		getFilteredItems,
    		listPlacement,
    		isVirtualList,
    		loadOptionsInterval,
    		noOptionsMessage,
    		hideEmptyState,
    		listAutoWidth,
    		itemHeight,
    		listOffset,
    		Item$1,
    		VirtualList$1,
    		selectedValue,
    		ariaValues,
    		ariaListOpen,
    		ariaFocused,
    		prev_value,
    		prev_filterText,
    		prev_isFocused,
    		prev_isMulti,
    		filteredItems,
    		input_1_binding,
    		input_1_input_handler,
    		switch_instance_hoverItemIndex_binding,
    		div_binding
    	];
    }

    class Select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$f,
    			create_fragment$f,
    			safe_not_equal,
    			{
    				id: 46,
    				container: 0,
    				input: 6,
    				isMulti: 7,
    				multiFullItemClearable: 8,
    				isDisabled: 9,
    				isCreatable: 47,
    				isFocused: 1,
    				value: 2,
    				filterText: 3,
    				placeholder: 48,
    				placeholderAlwaysShow: 49,
    				items: 50,
    				itemFilter: 51,
    				groupBy: 52,
    				groupFilter: 53,
    				isGroupHeaderSelectable: 54,
    				getGroupHeaderLabel: 55,
    				labelIdentifier: 56,
    				getOptionLabel: 57,
    				optionIdentifier: 58,
    				loadOptions: 59,
    				hasError: 10,
    				containerStyles: 11,
    				getSelectionLabel: 12,
    				createGroupHeaderItem: 60,
    				createItem: 61,
    				getFilteredItems: 62,
    				isSearchable: 13,
    				inputStyles: 14,
    				isClearable: 15,
    				isWaiting: 4,
    				listPlacement: 63,
    				listOpen: 5,
    				isVirtualList: 64,
    				loadOptionsInterval: 65,
    				noOptionsMessage: 66,
    				hideEmptyState: 67,
    				inputAttributes: 16,
    				listAutoWidth: 68,
    				itemHeight: 69,
    				Icon: 17,
    				iconProps: 18,
    				showChevron: 19,
    				showIndicator: 20,
    				containerClasses: 21,
    				indicatorSvg: 22,
    				listOffset: 70,
    				ClearIcon: 23,
    				Item: 71,
    				List: 24,
    				Selection: 25,
    				MultiSelection: 26,
    				VirtualList: 72,
    				selectedValue: 73,
    				handleClear: 27,
    				ariaValues: 74,
    				ariaListOpen: 75,
    				ariaFocused: 76
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Select",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get id() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get container() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isMulti() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isMulti(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiFullItemClearable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiFullItemClearable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDisabled() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDisabled(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCreatable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCreatable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFocused() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFocused(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterText() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterText(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholderAlwaysShow() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholderAlwaysShow(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemFilter() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemFilter(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get groupBy() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groupBy(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get groupFilter() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groupFilter(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isGroupHeaderSelectable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isGroupHeaderSelectable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getGroupHeaderLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getGroupHeaderLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelIdentifier() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelIdentifier(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getOptionLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getOptionLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get optionIdentifier() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set optionIdentifier(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loadOptions() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadOptions(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasError() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasError(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerStyles() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerStyles(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getSelectionLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getSelectionLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get createGroupHeaderItem() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set createGroupHeaderItem(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get createItem() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set createItem(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getFilteredItems() {
    		return this.$$.ctx[62];
    	}

    	set getFilteredItems(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSearchable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSearchable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputStyles() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputStyles(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isClearable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isClearable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isWaiting() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isWaiting(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listPlacement() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listPlacement(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listOpen() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listOpen(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isVirtualList() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isVirtualList(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loadOptionsInterval() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadOptionsInterval(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noOptionsMessage() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noOptionsMessage(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideEmptyState() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideEmptyState(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputAttributes() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputAttributes(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listAutoWidth() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listAutoWidth(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemHeight() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemHeight(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Icon() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Icon(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconProps() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconProps(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showChevron() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showChevron(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showIndicator() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showIndicator(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerClasses() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerClasses(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indicatorSvg() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indicatorSvg(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listOffset() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listOffset(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ClearIcon() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ClearIcon(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Item() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Item(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get List() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set List(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Selection() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Selection(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get MultiSelection() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set MultiSelection(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get VirtualList() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set VirtualList(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedValue() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedValue(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleClear() {
    		return this.$$.ctx[27];
    	}

    	set handleClear(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaValues() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaValues(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaListOpen() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaListOpen(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaFocused() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaFocused(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const API_BASE = "http://localhost:3000";
    const EMPTY_QUERY = {
        categories: [],
        clients: [],
        topics: [],
        tutors: [],
    };
    async function getCategories(filter, query) {
        const url = new URL("categories", API_BASE);
        url.searchParams.set("q", filter);
        query = Object.assign({}, EMPTY_QUERY, query);
        if (query.programme) {
            url.searchParams.set("programme", query.programme.id.toString());
        }
        for (const category of query.categories) {
            url.searchParams.append("categories", category.id.toString());
        }
        for (const tutor of query.tutors) {
            url.searchParams.append("tutors", tutor.id.toString());
        }
        for (const client of query.clients) {
            url.searchParams.append("clients", client.id.toString());
        }
        for (const topic of query.topics) {
            url.searchParams.append("topics", topic.id.toString());
        }
        return await fetch(url.toString()).then((result) => result.json());
    }
    async function getProgrammes(filter) {
        const url = new URL("programmes", API_BASE);
        url.searchParams.set("q", filter);
        return await fetch(url.toString()).then((result) => result.json());
    }
    async function getTutors(filter, query) {
        const url = new URL("tutors", API_BASE);
        url.searchParams.set("q", filter);
        if (query.programme) {
            url.searchParams.set("programme", query.programme.id.toString());
        }
        for (const category of query.categories) {
            url.searchParams.append("categories", category.id.toString());
        }
        for (const tutor of query.tutors) {
            url.searchParams.append("tutors", tutor.id.toString());
        }
        for (const client of query.clients) {
            url.searchParams.append("clients", client.id.toString());
        }
        for (const topic of query.topics) {
            url.searchParams.append("topics", topic.id.toString());
        }
        return await fetch(url.toString()).then((result) => result.json());
    }
    async function getTopics(filter, query) {
        const url = new URL("topics", API_BASE);
        url.searchParams.set("q", filter);
        url.searchParams.set("programme", query.programme.id.toString());
        for (const category of query.categories) {
            url.searchParams.append("categories", category.id.toString());
        }
        for (const tutor of query.tutors) {
            url.searchParams.append("tutors", tutor.id.toString());
        }
        for (const client of query.clients) {
            url.searchParams.append("clients", client.id.toString());
        }
        for (const topic of query.topics) {
            url.searchParams.append("topics", topic.id.toString());
        }
        return await fetch(url.toString()).then((result) => result.json());
    }

    /* src\components\SelectStudy.svelte generated by Svelte v3.52.0 */
    const file$d = "src\\components\\SelectStudy.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let label;
    	let t1;
    	let select;
    	let current;

    	select = new Select({
    			props: {
    				id: "programme",
    				items: /*programmes*/ ctx[0],
    				value: /*$query*/ ctx[1].programme,
    				optionIdentifier: optionIdentifier$2,
    				labelIdentifier: labelIdentifier$2
    			},
    			$$inline: true
    		});

    	select.$on("select", /*onSelect*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Select study programme...";
    			t1 = space();
    			create_component(select.$$.fragment);
    			attr_dev(label, "for", "programme");
    			attr_dev(label, "class", "label");
    			add_location(label, file$d, 16, 2, 425);
    			attr_dev(div, "class", "field");
    			add_location(div, file$d, 15, 0, 402);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t1);
    			mount_component(select, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const select_changes = {};
    			if (dirty & /*programmes*/ 1) select_changes.items = /*programmes*/ ctx[0];
    			if (dirty & /*$query*/ 2) select_changes.value = /*$query*/ ctx[1].programme;
    			select.$set(select_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(select);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const optionIdentifier$2 = "id";
    const labelIdentifier$2 = "name";

    function instance$e($$self, $$props, $$invalidate) {
    	let $query;
    	validate_store(query, 'query');
    	component_subscribe($$self, query, $$value => $$invalidate(1, $query = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectStudy', slots, []);
    	let programmes;

    	function onSelect(ev) {
    		set_store_value(query, $query.programme = ev.detail, $query);
    	}

    	onMount(async () => {
    		$$invalidate(0, programmes = await getProgrammes(""));
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectStudy> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Select,
    		getProgrammes,
    		query,
    		onMount,
    		optionIdentifier: optionIdentifier$2,
    		labelIdentifier: labelIdentifier$2,
    		programmes,
    		onSelect,
    		$query
    	});

    	$$self.$inject_state = $$props => {
    		if ('programmes' in $$props) $$invalidate(0, programmes = $$props.programmes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [programmes, $query, onSelect];
    }

    class SelectStudy extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectStudy",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\pages\Step-1.svelte generated by Svelte v3.52.0 */
    const file$c = "src\\pages\\Step-1.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let selectstudy;
    	let t0;
    	let button;
    	let t1;
    	let button_disabled_value;
    	let current;
    	let mounted;
    	let dispose;
    	selectstudy = new SelectStudy({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(selectstudy.$$.fragment);
    			t0 = space();
    			button = element("button");
    			t1 = text("Next");
    			button.disabled = button_disabled_value = !/*$query*/ ctx[0].programme ? true : null;
    			attr_dev(button, "class", "button is-primary");
    			add_location(button, file$c, 15, 2, 437);
    			attr_dev(div, "id", "steers-step-1");
    			attr_dev(div, "class", "svelte-i0e1pw");
    			add_location(div, file$c, 13, 0, 390);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(selectstudy, div, null);
    			append_dev(div, t0);
    			append_dev(div, button);
    			append_dev(button, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*onNext*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$query*/ 1 && button_disabled_value !== (button_disabled_value = !/*$query*/ ctx[0].programme ? true : null)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectstudy.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectstudy.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(selectstudy);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $query;
    	let $breadcrumbs;
    	validate_store(query, 'query');
    	component_subscribe($$self, query, $$value => $$invalidate(0, $query = $$value));
    	validate_store(breadcrumbs, 'breadcrumbs');
    	component_subscribe($$self, breadcrumbs, $$value => $$invalidate(2, $breadcrumbs = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Step_1', slots, []);
    	const navigate = useNavigate();

    	const onNext = () => {
    		set_store_value(breadcrumbs, $breadcrumbs = [...$breadcrumbs, { path: "/", label: $query.programme.name }], $breadcrumbs);
    		navigate("/interests");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Step_1> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		useNavigate,
    		SelectStudy,
    		query,
    		breadcrumbs,
    		navigate,
    		onNext,
    		$query,
    		$breadcrumbs
    	});

    	return [$query, onNext];
    }

    class Step_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Step_1",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\components\Debug.svelte generated by Svelte v3.52.0 */

    const file$b = "src\\components\\Debug.svelte";

    // (13:4) {#if expanded}
    function create_if_block$2(ctx) {
    	let pre;
    	let code;
    	let t_value = JSON.stringify(/*data*/ ctx[1], null, 2) + "";
    	let t;

    	const block = {
    		c: function create() {
    			pre = element("pre");
    			code = element("code");
    			t = text(t_value);
    			add_location(code, file$b, 13, 13, 291);
    			add_location(pre, file$b, 13, 8, 286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, pre, anchor);
    			append_dev(pre, code);
    			append_dev(code, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 2 && t_value !== (t_value = JSON.stringify(/*data*/ ctx[1], null, 2) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(pre);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(13:4) {#if expanded}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let button;
    	let t0;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block = /*expanded*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text("Debug: ");
    			t1 = text(/*label*/ ctx[0]);
    			t2 = space();
    			if (if_block) if_block.c();
    			attr_dev(button, "class", "button is-small my-2");
    			add_location(button, file$b, 6, 4, 116);
    			attr_dev(div, "class", "debug");
    			add_location(div, file$b, 5, 0, 91);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(div, t2);
    			if (if_block) if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 1) set_data_dev(t1, /*label*/ ctx[0]);

    			if (/*expanded*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Debug', slots, []);
    	let { label } = $$props;
    	let { data } = $$props;
    	let expanded = false;

    	$$self.$$.on_mount.push(function () {
    		if (label === undefined && !('label' in $$props || $$self.$$.bound[$$self.$$.props['label']])) {
    			console.warn("<Debug> was created without expected prop 'label'");
    		}

    		if (data === undefined && !('data' in $$props || $$self.$$.bound[$$self.$$.props['data']])) {
    			console.warn("<Debug> was created without expected prop 'data'");
    		}
    	});

    	const writable_props = ['label', 'data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Debug> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(2, expanded = !expanded);

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ label, data, expanded });

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('expanded' in $$props) $$invalidate(2, expanded = $$props.expanded);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, data, expanded, click_handler];
    }

    class Debug extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { label: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Debug",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get label() {
    		throw new Error("<Debug>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Debug>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Debug>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Debug>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SelectCategories.svelte generated by Svelte v3.52.0 */

    const { console: console_1$1 } = globals;
    const file$a = "src\\components\\SelectCategories.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let label;
    	let t1;
    	let select;
    	let t2;
    	let debug_1;
    	let current;

    	select = new Select({
    			props: {
    				id: "categories",
    				isDisabled: !/*$query*/ ctx[0].programme,
    				isMulti: true,
    				items: /*categories*/ ctx[1],
    				value: /*$query*/ ctx[0].categories,
    				optionIdentifier: optionIdentifier$1,
    				labelIdentifier: labelIdentifier$1,
    				loadOptions: /*func*/ ctx[3]
    			},
    			$$inline: true
    		});

    	select.$on("select", /*onSelect*/ ctx[2]);

    	debug_1 = new Debug({
    			props: {
    				label: "Categories",
    				data: {
    					selected: /*$query*/ ctx[0].categories,
    					options: /*categories*/ ctx[1]
    				}
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Select your interests...";
    			t1 = space();
    			create_component(select.$$.fragment);
    			t2 = space();
    			create_component(debug_1.$$.fragment);
    			attr_dev(label, "for", "categories");
    			attr_dev(label, "class", "label");
    			add_location(label, file$a, 27, 4, 872);
    			add_location(div, file$a, 26, 0, 861);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(div, t1);
    			mount_component(select, div, null);
    			append_dev(div, t2);
    			mount_component(debug_1, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const select_changes = {};
    			if (dirty & /*$query*/ 1) select_changes.isDisabled = !/*$query*/ ctx[0].programme;
    			if (dirty & /*categories*/ 2) select_changes.items = /*categories*/ ctx[1];
    			if (dirty & /*$query*/ 1) select_changes.value = /*$query*/ ctx[0].categories;
    			if (dirty & /*$query*/ 1) select_changes.loadOptions = /*func*/ ctx[3];
    			select.$set(select_changes);
    			const debug_1_changes = {};

    			if (dirty & /*$query, categories*/ 3) debug_1_changes.data = {
    				selected: /*$query*/ ctx[0].categories,
    				options: /*categories*/ ctx[1]
    			};

    			debug_1.$set(debug_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);
    			transition_in(debug_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);
    			transition_out(debug_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(select);
    			destroy_component(debug_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const optionIdentifier$1 = "id";
    const labelIdentifier$1 = "name";

    function instance$b($$self, $$props, $$invalidate) {
    	let $query;
    	validate_store(query, 'query');
    	component_subscribe($$self, query, $$value => $$invalidate(0, $query = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectCategories', slots, []);
    	let categories;

    	async function updateChoices(programme) {
    		if (!programme) {
    			$$invalidate(1, categories = []);
    			console.warn("attempted to get categories for NULL programme", { programme });
    			return;
    		}

    		$$invalidate(1, categories = await getCategories("", programme));
    	}

    	function onSelect(ev) {
    		var _a;

    		set_store_value(
    			query,
    			$query.categories = (_a = ev === null || ev === void 0 ? void 0 : ev.detail) !== null && _a !== void 0
    			? _a
    			: [],
    			$query
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<SelectCategories> was created with unknown prop '${key}'`);
    	});

    	const func = q => getCategories(q, $query.programme);

    	$$self.$capture_state = () => ({
    		Select,
    		getCategories,
    		query,
    		Debug,
    		categories,
    		optionIdentifier: optionIdentifier$1,
    		labelIdentifier: labelIdentifier$1,
    		updateChoices,
    		onSelect,
    		$query
    	});

    	$$self.$inject_state = $$props => {
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$query*/ 1) {
    			// update categories when programme selection changes
    			updateChoices($query.programme);
    		}
    	};

    	return [$query, categories, onSelect, func];
    }

    class SelectCategories extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectCategories",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\ChooseGoal.svelte generated by Svelte v3.52.0 */
    const file$9 = "src\\components\\ChooseGoal.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let button0;
    	let t2;
    	let button0_disabled_value;
    	let t3;
    	let button1;
    	let t4;
    	let button1_disabled_value;
    	let t5;
    	let button2;
    	let t6;
    	let button2_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "What are you looking for?";
    			t1 = space();
    			button0 = element("button");
    			t2 = text("Supervisor");
    			t3 = space();
    			button1 = element("button");
    			t4 = text("Topic");
    			t5 = space();
    			button2 = element("button");
    			t6 = text("Internship");
    			attr_dev(h2, "class", "title is-size-4 mt-6 mb-2");
    			add_location(h2, file$9, 22, 4, 595);
    			button0.disabled = button0_disabled_value = /*$query*/ ctx[0].categories.length > 0 ? null : true;
    			attr_dev(button0, "class", "button is-primary");
    			add_location(button0, file$9, 23, 4, 669);
    			button1.disabled = button1_disabled_value = /*$query*/ ctx[0].categories.length > 0 ? null : true;
    			attr_dev(button1, "class", "button is-primary");
    			add_location(button1, file$9, 28, 4, 855);
    			button2.disabled = button2_disabled_value = /*$query*/ ctx[0].categories.length > 0 ? null : true;
    			attr_dev(button2, "class", "button is-primary");
    			add_location(button2, file$9, 33, 4, 1031);
    			attr_dev(div, "class", "choose-goal");
    			add_location(div, file$9, 21, 0, 564);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, button0);
    			append_dev(button0, t2);
    			append_dev(div, t3);
    			append_dev(div, button1);
    			append_dev(button1, t4);
    			append_dev(div, t5);
    			append_dev(div, button2);
    			append_dev(button2, t6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*nextFunction*/ ctx[1]("/supervisors"), false, false, false),
    					listen_dev(button1, "click", /*nextFunction*/ ctx[1]("/topics"), false, false, false),
    					listen_dev(button2, "click", /*nextFunction*/ ctx[1]("/host"), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$query*/ 1 && button0_disabled_value !== (button0_disabled_value = /*$query*/ ctx[0].categories.length > 0 ? null : true)) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*$query*/ 1 && button1_disabled_value !== (button1_disabled_value = /*$query*/ ctx[0].categories.length > 0 ? null : true)) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty & /*$query*/ 1 && button2_disabled_value !== (button2_disabled_value = /*$query*/ ctx[0].categories.length > 0 ? null : true)) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $query;
    	let $breadcrumbs;
    	validate_store(query, 'query');
    	component_subscribe($$self, query, $$value => $$invalidate(0, $query = $$value));
    	validate_store(breadcrumbs, 'breadcrumbs');
    	component_subscribe($$self, breadcrumbs, $$value => $$invalidate(2, $breadcrumbs = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChooseGoal', slots, []);
    	const navigate = useNavigate();

    	const nextFunction = path => {
    		return () => {
    			set_store_value(
    				breadcrumbs,
    				$breadcrumbs = [
    					...$breadcrumbs,
    					{
    						path: "/interests",
    						label: $query.categories.map(c => c.name).join(", ")
    					}
    				],
    				$breadcrumbs
    			);

    			navigate(path);
    		};
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChooseGoal> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		useNavigate,
    		query,
    		breadcrumbs,
    		navigate,
    		nextFunction,
    		$query,
    		$breadcrumbs
    	});

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$query*/ 1) {
    			//   back to step 1 if no programme was selected
    			if (!$query.programme) {
    				navigate("/");
    			}
    		}
    	};

    	return [$query, nextFunction];
    }

    class ChooseGoal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChooseGoal",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\SimilarCategories.svelte generated by Svelte v3.52.0 */

    const { console: console_1 } = globals;
    const file$8 = "src\\components\\SimilarCategories.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (36:0) {#if $query.categories?.length}
    function create_if_block$1(ctx) {
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let debug_1;
    	let current;
    	let each_value = /*similar_categories*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	debug_1 = new Debug({
    			props: {
    				label: "Similarity",
    				data: /*similar_categories*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			div0.textContent = "You may also be interested in...";
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			create_component(debug_1.$$.fragment);
    			attr_dev(div0, "class", "label");
    			add_location(div0, file$8, 37, 4, 1233);
    			attr_dev(div1, "class", "similar-interests-list svelte-1ih8x4p");
    			add_location(div1, file$8, 38, 4, 1296);
    			attr_dev(div2, "class", "similar-interests mt-4");
    			add_location(div2, file$8, 36, 2, 1191);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div2, t2);
    			mount_component(debug_1, div2, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*loading, addCategory, similar_categories*/ 14) {
    				each_value = /*similar_categories*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const debug_1_changes = {};
    			if (dirty & /*similar_categories*/ 2) debug_1_changes.data = /*similar_categories*/ ctx[1];
    			debug_1.$set(debug_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(debug_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(debug_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			destroy_component(debug_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(36:0) {#if $query.categories?.length}",
    		ctx
    	});

    	return block;
    }

    // (40:6) {#each similar_categories as similar}
    function create_each_block$2(ctx) {
    	let button;
    	let t0_value = /*similar*/ ctx[6].name + "";
    	let t0;
    	let t1;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*similar*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(button, "class", "similar-interest button is-small is-info");
    			button.disabled = button_disabled_value = /*loading*/ ctx[2] ? true : null;
    			toggle_class(button, "is-loading", /*loading*/ ctx[2]);
    			add_location(button, file$8, 40, 8, 1387);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*similar_categories*/ 2 && t0_value !== (t0_value = /*similar*/ ctx[6].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*loading*/ 4 && button_disabled_value !== (button_disabled_value = /*loading*/ ctx[2] ? true : null)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}

    			if (dirty & /*loading*/ 4) {
    				toggle_class(button, "is-loading", /*loading*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(40:6) {#each similar_categories as similar}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$query*/ ctx[0].categories?.length && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$query*/ ctx[0].categories?.length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$query*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $query;
    	validate_store(query, 'query');
    	component_subscribe($$self, query, $$value => $$invalidate(0, $query = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SimilarCategories', slots, []);
    	let similar_categories = [];
    	let loading = false;

    	async function updateChoices(programme, categories) {
    		if (!programme) {
    			console.warn("attempted to get categories for NULL programme", { programme });
    			return;
    		}

    		try {
    			$$invalidate(2, loading = true);

    			$$invalidate(1, similar_categories = (await getCategories("", programme, $query.categories)).filter(category => {
    				return category.similarity && category.similarity >= 1 && !$query.categories.find(selected => selected.id === category.id);
    			}).sort((a, b) => b.similarity - a.similarity).slice(0, 6));
    		} finally {
    			$$invalidate(2, loading = false);
    		}
    	}

    	function addCategory(category) {
    		set_store_value(query, $query.categories = [...$query.categories, category], $query);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<SimilarCategories> was created with unknown prop '${key}'`);
    	});

    	const click_handler = similar => addCategory(similar);

    	$$self.$capture_state = () => ({
    		query,
    		getCategories,
    		Debug,
    		similar_categories,
    		loading,
    		updateChoices,
    		addCategory,
    		$query
    	});

    	$$self.$inject_state = $$props => {
    		if ('similar_categories' in $$props) $$invalidate(1, similar_categories = $$props.similar_categories);
    		if ('loading' in $$props) $$invalidate(2, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$query*/ 1) {
    			// update categories when programme or other selected categories change
    			updateChoices($query.programme, $query.categories);
    		}
    	};

    	return [$query, similar_categories, loading, addCategory, click_handler];
    }

    class SimilarCategories extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SimilarCategories",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\pages\Step-2.svelte generated by Svelte v3.52.0 */
    const file$7 = "src\\pages\\Step-2.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let selectcategories;
    	let t0;
    	let similarcategories;
    	let t1;
    	let choosegoal;
    	let current;
    	selectcategories = new SelectCategories({ $$inline: true });
    	similarcategories = new SimilarCategories({ $$inline: true });
    	choosegoal = new ChooseGoal({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(selectcategories.$$.fragment);
    			t0 = space();
    			create_component(similarcategories.$$.fragment);
    			t1 = space();
    			create_component(choosegoal.$$.fragment);
    			attr_dev(div, "id", "steers-step-1");
    			add_location(div, file$7, 5, 0, 234);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(selectcategories, div, null);
    			append_dev(div, t0);
    			mount_component(similarcategories, div, null);
    			append_dev(div, t1);
    			mount_component(choosegoal, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectcategories.$$.fragment, local);
    			transition_in(similarcategories.$$.fragment, local);
    			transition_in(choosegoal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectcategories.$$.fragment, local);
    			transition_out(similarcategories.$$.fragment, local);
    			transition_out(choosegoal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(selectcategories);
    			destroy_component(similarcategories);
    			destroy_component(choosegoal);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Step_2', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Step_2> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		SelectCategories,
    		ChooseGoal,
    		SimilarCategories
    	});

    	return [];
    }

    class Step_2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Step_2",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /** Detect free variable `global` from Node.js. */

    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    var _freeGlobal = freeGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = _freeGlobal || freeSelf || Function('return this')();

    var _root = root;

    /** Built-in value references. */
    var Symbol$1 = _root.Symbol;

    var _Symbol = Symbol$1;

    /** Used for built-in method references. */
    var objectProto$b = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$b.toString;

    /** Built-in value references. */
    var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty$8.call(value, symToStringTag$1),
          tag = value[symToStringTag$1];

      try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString$1.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag$1] = tag;
        } else {
          delete value[symToStringTag$1];
        }
      }
      return result;
    }

    var _getRawTag = getRawTag;

    /** Used for built-in method references. */
    var objectProto$a = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto$a.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    var _objectToString = objectToString;

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? _getRawTag(value)
        : _objectToString(value);
    }

    var _baseGetTag = baseGetTag;

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    var isObject_1 = isObject;

    /** `Object#toString` result references. */
    var asyncTag = '[object AsyncFunction]',
        funcTag$1 = '[object Function]',
        genTag = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject_1(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = _baseGetTag(value);
      return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    var isFunction_1 = isFunction;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = _root['__core-js_shared__'];

    var _coreJsData = coreJsData;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    var _isMasked = isMasked;

    /** Used for built-in method references. */
    var funcProto$1 = Function.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$1 = funcProto$1.toString;

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString$1.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    var _toSource = toSource;

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for built-in method references. */
    var funcProto = Function.prototype,
        objectProto$9 = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty$7).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject_1(value) || _isMasked(value)) {
        return false;
      }
      var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
      return pattern.test(_toSource(value));
    }

    var _baseIsNative = baseIsNative;

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    var _getValue = getValue;

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = _getValue(object, key);
      return _baseIsNative(value) ? value : undefined;
    }

    var _getNative = getNative;

    /* Built-in method references that are verified to be native. */
    var nativeCreate = _getNative(Object, 'create');

    var _nativeCreate = nativeCreate;

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
      this.size = 0;
    }

    var _hashClear = hashClear;

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    var _hashDelete = hashDelete;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

    /** Used for built-in method references. */
    var objectProto$8 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (_nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED$2 ? undefined : result;
      }
      return hasOwnProperty$6.call(data, key) ? data[key] : undefined;
    }

    var _hashGet = hashGet;

    /** Used for built-in method references. */
    var objectProto$7 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$5.call(data, key);
    }

    var _hashHas = hashHas;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
      return this;
    }

    var _hashSet = hashSet;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = _hashClear;
    Hash.prototype['delete'] = _hashDelete;
    Hash.prototype.get = _hashGet;
    Hash.prototype.has = _hashHas;
    Hash.prototype.set = _hashSet;

    var _Hash = Hash;

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    var _listCacheClear = listCacheClear;

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    var eq_1 = eq;

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq_1(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    var _assocIndexOf = assocIndexOf;

    /** Used for built-in method references. */
    var arrayProto = Array.prototype;

    /** Built-in value references. */
    var splice = arrayProto.splice;

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    var _listCacheDelete = listCacheDelete;

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    var _listCacheGet = listCacheGet;

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return _assocIndexOf(this.__data__, key) > -1;
    }

    var _listCacheHas = listCacheHas;

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = _assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    var _listCacheSet = listCacheSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = _listCacheClear;
    ListCache.prototype['delete'] = _listCacheDelete;
    ListCache.prototype.get = _listCacheGet;
    ListCache.prototype.has = _listCacheHas;
    ListCache.prototype.set = _listCacheSet;

    var _ListCache = ListCache;

    /* Built-in method references that are verified to be native. */
    var Map$1 = _getNative(_root, 'Map');

    var _Map = Map$1;

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        'hash': new _Hash,
        'map': new (_Map || _ListCache),
        'string': new _Hash
      };
    }

    var _mapCacheClear = mapCacheClear;

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    var _isKeyable = isKeyable;

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return _isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    var _getMapData = getMapData;

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = _getMapData(this, key)['delete'](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    var _mapCacheDelete = mapCacheDelete;

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return _getMapData(this, key).get(key);
    }

    var _mapCacheGet = mapCacheGet;

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return _getMapData(this, key).has(key);
    }

    var _mapCacheHas = mapCacheHas;

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = _getMapData(this, key),
          size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    var _mapCacheSet = mapCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = _mapCacheClear;
    MapCache.prototype['delete'] = _mapCacheDelete;
    MapCache.prototype.get = _mapCacheGet;
    MapCache.prototype.has = _mapCacheHas;
    MapCache.prototype.set = _mapCacheSet;

    var _MapCache = MapCache;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    var _setCacheAdd = setCacheAdd;

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    var _setCacheHas = setCacheHas;

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
          length = values == null ? 0 : values.length;

      this.__data__ = new _MapCache;
      while (++index < length) {
        this.add(values[index]);
      }
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
    SetCache.prototype.has = _setCacheHas;

    var _SetCache = SetCache;

    /**
     * The base implementation of `_.findIndex` and `_.findLastIndex` without
     * support for iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Function} predicate The function invoked per iteration.
     * @param {number} fromIndex The index to search from.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length,
          index = fromIndex + (fromRight ? 1 : -1);

      while ((fromRight ? index-- : ++index < length)) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    var _baseFindIndex = baseFindIndex;

    /**
     * The base implementation of `_.isNaN` without support for number objects.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     */
    function baseIsNaN(value) {
      return value !== value;
    }

    var _baseIsNaN = baseIsNaN;

    /**
     * A specialized version of `_.indexOf` which performs strict equality
     * comparisons of values, i.e. `===`.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function strictIndexOf(array, value, fromIndex) {
      var index = fromIndex - 1,
          length = array.length;

      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    var _strictIndexOf = strictIndexOf;

    /**
     * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseIndexOf(array, value, fromIndex) {
      return value === value
        ? _strictIndexOf(array, value, fromIndex)
        : _baseFindIndex(array, _baseIsNaN, fromIndex);
    }

    var _baseIndexOf = baseIndexOf;

    /**
     * A specialized version of `_.includes` for arrays without support for
     * specifying an index to search from.
     *
     * @private
     * @param {Array} [array] The array to inspect.
     * @param {*} target The value to search for.
     * @returns {boolean} Returns `true` if `target` is found, else `false`.
     */
    function arrayIncludes(array, value) {
      var length = array == null ? 0 : array.length;
      return !!length && _baseIndexOf(array, value, 0) > -1;
    }

    var _arrayIncludes = arrayIncludes;

    /**
     * This function is like `arrayIncludes` except that it accepts a comparator.
     *
     * @private
     * @param {Array} [array] The array to inspect.
     * @param {*} target The value to search for.
     * @param {Function} comparator The comparator invoked per element.
     * @returns {boolean} Returns `true` if `target` is found, else `false`.
     */
    function arrayIncludesWith(array, value, comparator) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (comparator(value, array[index])) {
          return true;
        }
      }
      return false;
    }

    var _arrayIncludesWith = arrayIncludesWith;

    /**
     * A specialized version of `_.map` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the new mapped array.
     */
    function arrayMap(array, iteratee) {
      var index = -1,
          length = array == null ? 0 : array.length,
          result = Array(length);

      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }

    var _arrayMap = arrayMap;

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }

    var _baseUnary = baseUnary;

    /**
     * Checks if a `cache` value for `key` exists.
     *
     * @private
     * @param {Object} cache The cache to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function cacheHas(cache, key) {
      return cache.has(key);
    }

    var _cacheHas = cacheHas;

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE$1 = 200;

    /**
     * The base implementation of methods like `_.difference` without support
     * for excluding multiple arrays or iteratee shorthands.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {Array} values The values to exclude.
     * @param {Function} [iteratee] The iteratee invoked per element.
     * @param {Function} [comparator] The comparator invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     */
    function baseDifference(array, values, iteratee, comparator) {
      var index = -1,
          includes = _arrayIncludes,
          isCommon = true,
          length = array.length,
          result = [],
          valuesLength = values.length;

      if (!length) {
        return result;
      }
      if (iteratee) {
        values = _arrayMap(values, _baseUnary(iteratee));
      }
      if (comparator) {
        includes = _arrayIncludesWith;
        isCommon = false;
      }
      else if (values.length >= LARGE_ARRAY_SIZE$1) {
        includes = _cacheHas;
        isCommon = false;
        values = new _SetCache(values);
      }
      outer:
      while (++index < length) {
        var value = array[index],
            computed = iteratee == null ? value : iteratee(value);

        value = (comparator || value !== 0) ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        }
        else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
      return result;
    }

    var _baseDifference = baseDifference;

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
          length = values.length,
          offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    var _arrayPush = arrayPush;

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    var isObjectLike_1 = isObjectLike;

    /** `Object#toString` result references. */
    var argsTag$2 = '[object Arguments]';

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike_1(value) && _baseGetTag(value) == argsTag$2;
    }

    var _baseIsArguments = baseIsArguments;

    /** Used for built-in method references. */
    var objectProto$6 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

    /** Built-in value references. */
    var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
      return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') &&
        !propertyIsEnumerable$1.call(value, 'callee');
    };

    var isArguments_1 = isArguments;

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    var isArray_1 = isArray;

    /** Built-in value references. */
    var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

    /**
     * Checks if `value` is a flattenable `arguments` object or array.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
     */
    function isFlattenable(value) {
      return isArray_1(value) || isArguments_1(value) ||
        !!(spreadableSymbol && value && value[spreadableSymbol]);
    }

    var _isFlattenable = isFlattenable;

    /**
     * The base implementation of `_.flatten` with support for restricting flattening.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {number} depth The maximum recursion depth.
     * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
     * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
     * @param {Array} [result=[]] The initial result value.
     * @returns {Array} Returns the new flattened array.
     */
    function baseFlatten(array, depth, predicate, isStrict, result) {
      var index = -1,
          length = array.length;

      predicate || (predicate = _isFlattenable);
      result || (result = []);

      while (++index < length) {
        var value = array[index];
        if (depth > 0 && predicate(value)) {
          if (depth > 1) {
            // Recursively flatten arrays (susceptible to call stack limits).
            baseFlatten(value, depth - 1, predicate, isStrict, result);
          } else {
            _arrayPush(result, value);
          }
        } else if (!isStrict) {
          result[result.length] = value;
        }
      }
      return result;
    }

    var _baseFlatten = baseFlatten;

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new _ListCache;
      this.size = 0;
    }

    var _stackClear = stackClear;

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
          result = data['delete'](key);

      this.size = data.size;
      return result;
    }

    var _stackDelete = stackDelete;

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    var _stackGet = stackGet;

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    var _stackHas = stackHas;

    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof _ListCache) {
        var pairs = data.__data__;
        if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new _MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    var _stackSet = stackSet;

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = this.__data__ = new _ListCache(entries);
      this.size = data.size;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = _stackClear;
    Stack.prototype['delete'] = _stackDelete;
    Stack.prototype.get = _stackGet;
    Stack.prototype.has = _stackHas;
    Stack.prototype.set = _stackSet;

    var _Stack = Stack;

    /**
     * A specialized version of `_.some` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    var _arraySome = arraySome;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$5 = 1,
        COMPARE_UNORDERED_FLAG$3 = 2;

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5,
          arrLength = array.length,
          othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Check that cyclic values are equal.
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1,
          result = true,
          seen = (bitmask & COMPARE_UNORDERED_FLAG$3) ? new _SetCache : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
            othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (!_arraySome(other, function(othValue, othIndex) {
                if (!_cacheHas(seen, othIndex) &&
                    (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                  return seen.push(othIndex);
                }
              })) {
            result = false;
            break;
          }
        } else if (!(
              arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack)
            )) {
          result = false;
          break;
        }
      }
      stack['delete'](array);
      stack['delete'](other);
      return result;
    }

    var _equalArrays = equalArrays;

    /** Built-in value references. */
    var Uint8Array = _root.Uint8Array;

    var _Uint8Array = Uint8Array;

    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */
    function mapToArray(map) {
      var index = -1,
          result = Array(map.size);

      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }

    var _mapToArray = mapToArray;

    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */
    function setToArray(set) {
      var index = -1,
          result = Array(set.size);

      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }

    var _setToArray = setToArray;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$4 = 1,
        COMPARE_UNORDERED_FLAG$2 = 2;

    /** `Object#toString` result references. */
    var boolTag$1 = '[object Boolean]',
        dateTag$1 = '[object Date]',
        errorTag$1 = '[object Error]',
        mapTag$2 = '[object Map]',
        numberTag$1 = '[object Number]',
        regexpTag$1 = '[object RegExp]',
        setTag$2 = '[object Set]',
        stringTag$1 = '[object String]',
        symbolTag$1 = '[object Symbol]';

    var arrayBufferTag$1 = '[object ArrayBuffer]',
        dataViewTag$2 = '[object DataView]';

    /** Used to convert symbols to primitives and strings. */
    var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
        symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag$2:
          if ((object.byteLength != other.byteLength) ||
              (object.byteOffset != other.byteOffset)) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag$1:
          if ((object.byteLength != other.byteLength) ||
              !equalFunc(new _Uint8Array(object), new _Uint8Array(other))) {
            return false;
          }
          return true;

        case boolTag$1:
        case dateTag$1:
        case numberTag$1:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq_1(+object, +other);

        case errorTag$1:
          return object.name == other.name && object.message == other.message;

        case regexpTag$1:
        case stringTag$1:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == (other + '');

        case mapTag$2:
          var convert = _mapToArray;

        case setTag$2:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
          convert || (convert = _setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG$2;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = _equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack['delete'](object);
          return result;

        case symbolTag$1:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    var _equalByTag = equalByTag;

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
    }

    var _baseGetAllKeys = baseGetAllKeys;

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
          length = array == null ? 0 : array.length,
          resIndex = 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    var _arrayFilter = arrayFilter;

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    var stubArray_1 = stubArray;

    /** Used for built-in method references. */
    var objectProto$5 = Object.prototype;

    /** Built-in value references. */
    var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols;

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return _arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };

    var _getSymbols = getSymbols;

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
          result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    var _baseTimes = baseTimes;

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    var stubFalse_1 = stubFalse;

    var isBuffer_1 = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? _root.Buffer : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse_1;

    module.exports = isBuffer;
    });

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER$1 = 9007199254740991;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER$1 : length;

      return !!length &&
        (type == 'number' ||
          (type != 'symbol' && reIsUint.test(value))) &&
            (value > -1 && value % 1 == 0 && value < length);
    }

    var _isIndex = isIndex;

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }

    var isLength_1 = isLength;

    /** `Object#toString` result references. */
    var argsTag$1 = '[object Arguments]',
        arrayTag$1 = '[object Array]',
        boolTag = '[object Boolean]',
        dateTag = '[object Date]',
        errorTag = '[object Error]',
        funcTag = '[object Function]',
        mapTag$1 = '[object Map]',
        numberTag = '[object Number]',
        objectTag$2 = '[object Object]',
        regexpTag = '[object RegExp]',
        setTag$1 = '[object Set]',
        stringTag = '[object String]',
        weakMapTag$1 = '[object WeakMap]';

    var arrayBufferTag = '[object ArrayBuffer]',
        dataViewTag$1 = '[object DataView]',
        float32Tag = '[object Float32Array]',
        float64Tag = '[object Float64Array]',
        int8Tag = '[object Int8Array]',
        int16Tag = '[object Int16Array]',
        int32Tag = '[object Int32Array]',
        uint8Tag = '[object Uint8Array]',
        uint8ClampedTag = '[object Uint8ClampedArray]',
        uint16Tag = '[object Uint16Array]',
        uint32Tag = '[object Uint32Array]';

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
    typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
    typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
    typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
    typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag$1] = typedArrayTags[arrayTag$1] =
    typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
    typedArrayTags[dataViewTag$1] = typedArrayTags[dateTag] =
    typedArrayTags[errorTag] = typedArrayTags[funcTag] =
    typedArrayTags[mapTag$1] = typedArrayTags[numberTag] =
    typedArrayTags[objectTag$2] = typedArrayTags[regexpTag] =
    typedArrayTags[setTag$1] = typedArrayTags[stringTag] =
    typedArrayTags[weakMapTag$1] = false;

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return isObjectLike_1(value) &&
        isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
    }

    var _baseIsTypedArray = baseIsTypedArray;

    var _nodeUtil = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports && _freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        }

        // Legacy `process.binding('util')` for Node.js < 10.
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }());

    module.exports = nodeUtil;
    });

    /* Node.js helper references. */
    var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

    var isTypedArray_1 = isTypedArray;

    /** Used for built-in method references. */
    var objectProto$4 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray_1(value),
          isArg = !isArr && isArguments_1(value),
          isBuff = !isArr && !isArg && isBuffer_1(value),
          isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
          skipIndexes = isArr || isArg || isBuff || isType,
          result = skipIndexes ? _baseTimes(value.length, String) : [],
          length = result.length;

      for (var key in value) {
        if ((inherited || hasOwnProperty$3.call(value, key)) &&
            !(skipIndexes && (
               // Safari 9 has enumerable `arguments.length` in strict mode.
               key == 'length' ||
               // Node.js 0.10 has enumerable non-index properties on buffers.
               (isBuff && (key == 'offset' || key == 'parent')) ||
               // PhantomJS 2 has enumerable non-index properties on typed arrays.
               (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
               // Skip index properties.
               _isIndex(key, length)
            ))) {
          result.push(key);
        }
      }
      return result;
    }

    var _arrayLikeKeys = arrayLikeKeys;

    /** Used for built-in method references. */
    var objectProto$3 = Object.prototype;

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
          proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$3;

      return value === proto;
    }

    var _isPrototype = isPrototype;

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }

    var _overArg = overArg;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeKeys = _overArg(Object.keys, Object);

    var _nativeKeys = nativeKeys;

    /** Used for built-in method references. */
    var objectProto$2 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!_isPrototype(object)) {
        return _nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty$2.call(object, key) && key != 'constructor') {
          result.push(key);
        }
      }
      return result;
    }

    var _baseKeys = baseKeys;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength_1(value.length) && !isFunction_1(value);
    }

    var isArrayLike_1 = isArrayLike;

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
    }

    var keys_1 = keys;

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return _baseGetAllKeys(object, keys_1, _getSymbols);
    }

    var _getAllKeys = getAllKeys;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$3 = 1;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3,
          objProps = _getAllKeys(object),
          objLength = objProps.length,
          othProps = _getAllKeys(other),
          othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty$1.call(other, key))) {
          return false;
        }
      }
      // Check that cyclic values are equal.
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
            othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined
              ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
              : compared
            )) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == 'constructor');
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
            othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor &&
            ('constructor' in object && 'constructor' in other) &&
            !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
              typeof othCtor == 'function' && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack['delete'](object);
      stack['delete'](other);
      return result;
    }

    var _equalObjects = equalObjects;

    /* Built-in method references that are verified to be native. */
    var DataView = _getNative(_root, 'DataView');

    var _DataView = DataView;

    /* Built-in method references that are verified to be native. */
    var Promise$1 = _getNative(_root, 'Promise');

    var _Promise = Promise$1;

    /* Built-in method references that are verified to be native. */
    var Set$1 = _getNative(_root, 'Set');

    var _Set = Set$1;

    /* Built-in method references that are verified to be native. */
    var WeakMap = _getNative(_root, 'WeakMap');

    var _WeakMap = WeakMap;

    /** `Object#toString` result references. */
    var mapTag = '[object Map]',
        objectTag$1 = '[object Object]',
        promiseTag = '[object Promise]',
        setTag = '[object Set]',
        weakMapTag = '[object WeakMap]';

    var dataViewTag = '[object DataView]';

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = _toSource(_DataView),
        mapCtorString = _toSource(_Map),
        promiseCtorString = _toSource(_Promise),
        setCtorString = _toSource(_Set),
        weakMapCtorString = _toSource(_WeakMap);

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = _baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (_Map && getTag(new _Map) != mapTag) ||
        (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
        (_Set && getTag(new _Set) != setTag) ||
        (_WeakMap && getTag(new _WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = _baseGetTag(value),
            Ctor = result == objectTag$1 ? value.constructor : undefined,
            ctorString = Ctor ? _toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    var _getTag = getTag;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$2 = 1;

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]',
        arrayTag = '[object Array]',
        objectTag = '[object Object]';

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray_1(object),
          othIsArr = isArray_1(other),
          objTag = objIsArr ? arrayTag : _getTag(object),
          othTag = othIsArr ? arrayTag : _getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
          othIsObj = othTag == objectTag,
          isSameTag = objTag == othTag;

      if (isSameTag && isBuffer_1(object)) {
        if (!isBuffer_1(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new _Stack);
        return (objIsArr || isTypedArray_1(object))
          ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : _equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
            othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
              othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new _Stack);
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new _Stack);
      return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    var _baseIsEqualDeep = baseIsEqualDeep;

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || (!isObjectLike_1(value) && !isObjectLike_1(other))) {
        return value !== value && other !== other;
      }
      return _baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }

    var _baseIsEqual = baseIsEqual;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG$1 = 1,
        COMPARE_UNORDERED_FLAG$1 = 2;

    /**
     * The base implementation of `_.isMatch` without support for iteratee shorthands.
     *
     * @private
     * @param {Object} object The object to inspect.
     * @param {Object} source The object of property values to match.
     * @param {Array} matchData The property names, values, and compare flags to match.
     * @param {Function} [customizer] The function to customize comparisons.
     * @returns {boolean} Returns `true` if `object` is a match, else `false`.
     */
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length,
          length = index,
          noCustomizer = !customizer;

      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if ((noCustomizer && data[2])
              ? data[1] !== object[data[0]]
              : !(data[0] in object)
            ) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0],
            objValue = object[key],
            srcValue = data[1];

        if (noCustomizer && data[2]) {
          if (objValue === undefined && !(key in object)) {
            return false;
          }
        } else {
          var stack = new _Stack;
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === undefined
                ? _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack)
                : result
              )) {
            return false;
          }
        }
      }
      return true;
    }

    var _baseIsMatch = baseIsMatch;

    /**
     * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` if suitable for strict
     *  equality comparisons, else `false`.
     */
    function isStrictComparable(value) {
      return value === value && !isObject_1(value);
    }

    var _isStrictComparable = isStrictComparable;

    /**
     * Gets the property names, values, and compare flags of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the match data of `object`.
     */
    function getMatchData(object) {
      var result = keys_1(object),
          length = result.length;

      while (length--) {
        var key = result[length],
            value = object[key];

        result[length] = [key, value, _isStrictComparable(value)];
      }
      return result;
    }

    var _getMatchData = getMatchData;

    /**
     * A specialized version of `matchesProperty` for source values suitable
     * for strict equality comparisons, i.e. `===`.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue &&
          (srcValue !== undefined || (key in Object(object)));
      };
    }

    var _matchesStrictComparable = matchesStrictComparable;

    /**
     * The base implementation of `_.matches` which doesn't clone `source`.
     *
     * @private
     * @param {Object} source The object of property values to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatches(source) {
      var matchData = _getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || _baseIsMatch(object, source, matchData);
      };
    }

    var _baseMatches = baseMatches;

    /** `Object#toString` result references. */
    var symbolTag = '[object Symbol]';

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
    }

    var isSymbol_1 = isSymbol;

    /** Used to match property names within property paths. */
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        reIsPlainProp = /^\w*$/;

    /**
     * Checks if `value` is a property name and not a property path.
     *
     * @private
     * @param {*} value The value to check.
     * @param {Object} [object] The object to query keys on.
     * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
     */
    function isKey(value, object) {
      if (isArray_1(value)) {
        return false;
      }
      var type = typeof value;
      if (type == 'number' || type == 'symbol' || type == 'boolean' ||
          value == null || isSymbol_1(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
        (object != null && value in Object(object));
    }

    var _isKey = isKey;

    /** Error message constants. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `clear`, `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result) || cache;
        return result;
      };
      memoized.cache = new (memoize.Cache || _MapCache);
      return memoized;
    }

    // Expose `MapCache`.
    memoize.Cache = _MapCache;

    var memoize_1 = memoize;

    /** Used as the maximum memoize cache size. */
    var MAX_MEMOIZE_SIZE = 500;

    /**
     * A specialized version of `_.memoize` which clears the memoized function's
     * cache when it exceeds `MAX_MEMOIZE_SIZE`.
     *
     * @private
     * @param {Function} func The function to have its output memoized.
     * @returns {Function} Returns the new memoized function.
     */
    function memoizeCapped(func) {
      var result = memoize_1(func, function(key) {
        if (cache.size === MAX_MEMOIZE_SIZE) {
          cache.clear();
        }
        return key;
      });

      var cache = result.cache;
      return result;
    }

    var _memoizeCapped = memoizeCapped;

    /** Used to match property names within property paths. */
    var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

    /** Used to match backslashes in property paths. */
    var reEscapeChar = /\\(\\)?/g;

    /**
     * Converts `string` to a property path array.
     *
     * @private
     * @param {string} string The string to convert.
     * @returns {Array} Returns the property path array.
     */
    var stringToPath = _memoizeCapped(function(string) {
      var result = [];
      if (string.charCodeAt(0) === 46 /* . */) {
        result.push('');
      }
      string.replace(rePropName, function(match, number, quote, subString) {
        result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
      });
      return result;
    });

    var _stringToPath = stringToPath;

    /** Used as references for various `Number` constants. */
    var INFINITY$1 = 1 / 0;

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = _Symbol ? _Symbol.prototype : undefined,
        symbolToString = symbolProto ? symbolProto.toString : undefined;

    /**
     * The base implementation of `_.toString` which doesn't convert nullish
     * values to empty strings.
     *
     * @private
     * @param {*} value The value to process.
     * @returns {string} Returns the string.
     */
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value;
      }
      if (isArray_1(value)) {
        // Recursively convert values (susceptible to call stack limits).
        return _arrayMap(value, baseToString) + '';
      }
      if (isSymbol_1(value)) {
        return symbolToString ? symbolToString.call(value) : '';
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
    }

    var _baseToString = baseToString;

    /**
     * Converts `value` to a string. An empty string is returned for `null`
     * and `undefined` values. The sign of `-0` is preserved.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     * @example
     *
     * _.toString(null);
     * // => ''
     *
     * _.toString(-0);
     * // => '-0'
     *
     * _.toString([1, 2, 3]);
     * // => '1,2,3'
     */
    function toString(value) {
      return value == null ? '' : _baseToString(value);
    }

    var toString_1 = toString;

    /**
     * Casts `value` to a path array if it's not one.
     *
     * @private
     * @param {*} value The value to inspect.
     * @param {Object} [object] The object to query keys on.
     * @returns {Array} Returns the cast property path array.
     */
    function castPath(value, object) {
      if (isArray_1(value)) {
        return value;
      }
      return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
    }

    var _castPath = castPath;

    /** Used as references for various `Number` constants. */
    var INFINITY = 1 / 0;

    /**
     * Converts `value` to a string key if it's not a string or symbol.
     *
     * @private
     * @param {*} value The value to inspect.
     * @returns {string|symbol} Returns the key.
     */
    function toKey(value) {
      if (typeof value == 'string' || isSymbol_1(value)) {
        return value;
      }
      var result = (value + '');
      return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
    }

    var _toKey = toKey;

    /**
     * The base implementation of `_.get` without support for default values.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @returns {*} Returns the resolved value.
     */
    function baseGet(object, path) {
      path = _castPath(path, object);

      var index = 0,
          length = path.length;

      while (object != null && index < length) {
        object = object[_toKey(path[index++])];
      }
      return (index && index == length) ? object : undefined;
    }

    var _baseGet = baseGet;

    /**
     * Gets the value at `path` of `object`. If the resolved value is
     * `undefined`, the `defaultValue` is returned in its place.
     *
     * @static
     * @memberOf _
     * @since 3.7.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path of the property to get.
     * @param {*} [defaultValue] The value returned for `undefined` resolved values.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = { 'a': [{ 'b': { 'c': 3 } }] };
     *
     * _.get(object, 'a[0].b.c');
     * // => 3
     *
     * _.get(object, ['a', '0', 'b', 'c']);
     * // => 3
     *
     * _.get(object, 'a.b.c', 'default');
     * // => 'default'
     */
    function get(object, path, defaultValue) {
      var result = object == null ? undefined : _baseGet(object, path);
      return result === undefined ? defaultValue : result;
    }

    var get_1 = get;

    /**
     * The base implementation of `_.hasIn` without support for deep paths.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {Array|string} key The key to check.
     * @returns {boolean} Returns `true` if `key` exists, else `false`.
     */
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }

    var _baseHasIn = baseHasIn;

    /**
     * Checks if `path` exists on `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @param {Function} hasFunc The function to check properties.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     */
    function hasPath(object, path, hasFunc) {
      path = _castPath(path, object);

      var index = -1,
          length = path.length,
          result = false;

      while (++index < length) {
        var key = _toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength_1(length) && _isIndex(key, length) &&
        (isArray_1(object) || isArguments_1(object));
    }

    var _hasPath = hasPath;

    /**
     * Checks if `path` is a direct or inherited property of `object`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Object
     * @param {Object} object The object to query.
     * @param {Array|string} path The path to check.
     * @returns {boolean} Returns `true` if `path` exists, else `false`.
     * @example
     *
     * var object = _.create({ 'a': _.create({ 'b': 2 }) });
     *
     * _.hasIn(object, 'a');
     * // => true
     *
     * _.hasIn(object, 'a.b');
     * // => true
     *
     * _.hasIn(object, ['a', 'b']);
     * // => true
     *
     * _.hasIn(object, 'b');
     * // => false
     */
    function hasIn(object, path) {
      return object != null && _hasPath(object, path, _baseHasIn);
    }

    var hasIn_1 = hasIn;

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG = 1,
        COMPARE_UNORDERED_FLAG = 2;

    /**
     * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
     *
     * @private
     * @param {string} path The path of the property to get.
     * @param {*} srcValue The value to match.
     * @returns {Function} Returns the new spec function.
     */
    function baseMatchesProperty(path, srcValue) {
      if (_isKey(path) && _isStrictComparable(srcValue)) {
        return _matchesStrictComparable(_toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get_1(object, path);
        return (objValue === undefined && objValue === srcValue)
          ? hasIn_1(object, path)
          : _baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }

    var _baseMatchesProperty = baseMatchesProperty;

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    var identity_1 = identity;

    /**
     * The base implementation of `_.property` without support for deep paths.
     *
     * @private
     * @param {string} key The key of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined : object[key];
      };
    }

    var _baseProperty = baseProperty;

    /**
     * A specialized version of `baseProperty` which supports deep paths.
     *
     * @private
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     */
    function basePropertyDeep(path) {
      return function(object) {
        return _baseGet(object, path);
      };
    }

    var _basePropertyDeep = basePropertyDeep;

    /**
     * Creates a function that returns the value at `path` of a given object.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {Array|string} path The path of the property to get.
     * @returns {Function} Returns the new accessor function.
     * @example
     *
     * var objects = [
     *   { 'a': { 'b': 2 } },
     *   { 'a': { 'b': 1 } }
     * ];
     *
     * _.map(objects, _.property('a.b'));
     * // => [2, 1]
     *
     * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
     * // => [1, 2]
     */
    function property(path) {
      return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
    }

    var property_1 = property;

    /**
     * The base implementation of `_.iteratee`.
     *
     * @private
     * @param {*} [value=_.identity] The value to convert to an iteratee.
     * @returns {Function} Returns the iteratee.
     */
    function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity_1;
      }
      if (typeof value == 'object') {
        return isArray_1(value)
          ? _baseMatchesProperty(value[0], value[1])
          : _baseMatches(value);
      }
      return property_1(value);
    }

    var _baseIteratee = baseIteratee;

    /**
     * A faster alternative to `Function#apply`, this function invokes `func`
     * with the `this` binding of `thisArg` and the arguments of `args`.
     *
     * @private
     * @param {Function} func The function to invoke.
     * @param {*} thisArg The `this` binding of `func`.
     * @param {Array} args The arguments to invoke `func` with.
     * @returns {*} Returns the result of `func`.
     */
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0: return func.call(thisArg);
        case 1: return func.call(thisArg, args[0]);
        case 2: return func.call(thisArg, args[0], args[1]);
        case 3: return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }

    var _apply = apply;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeMax = Math.max;

    /**
     * A specialized version of `baseRest` which transforms the rest array.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @param {Function} transform The rest array transform.
     * @returns {Function} Returns the new function.
     */
    function overRest(func, start, transform) {
      start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
      return function() {
        var args = arguments,
            index = -1,
            length = nativeMax(args.length - start, 0),
            array = Array(length);

        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return _apply(func, this, otherArgs);
      };
    }

    var _overRest = overRest;

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Util
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new constant function.
     * @example
     *
     * var objects = _.times(2, _.constant({ 'a': 1 }));
     *
     * console.log(objects);
     * // => [{ 'a': 1 }, { 'a': 1 }]
     *
     * console.log(objects[0] === objects[1]);
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    var constant_1 = constant;

    var defineProperty = (function() {
      try {
        var func = _getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    var _defineProperty = defineProperty;

    /**
     * The base implementation of `setToString` without support for hot loop shorting.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
      return _defineProperty(func, 'toString', {
        'configurable': true,
        'enumerable': false,
        'value': constant_1(string),
        'writable': true
      });
    };

    var _baseSetToString = baseSetToString;

    /** Used to detect hot functions by number of calls within a span of milliseconds. */
    var HOT_COUNT = 800,
        HOT_SPAN = 16;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeNow = Date.now;

    /**
     * Creates a function that'll short out and invoke `identity` instead
     * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
     * milliseconds.
     *
     * @private
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new shortable function.
     */
    function shortOut(func) {
      var count = 0,
          lastCalled = 0;

      return function() {
        var stamp = nativeNow(),
            remaining = HOT_SPAN - (stamp - lastCalled);

        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(undefined, arguments);
      };
    }

    var _shortOut = shortOut;

    /**
     * Sets the `toString` method of `func` to return `string`.
     *
     * @private
     * @param {Function} func The function to modify.
     * @param {Function} string The `toString` result.
     * @returns {Function} Returns `func`.
     */
    var setToString = _shortOut(_baseSetToString);

    var _setToString = setToString;

    /**
     * The base implementation of `_.rest` which doesn't validate or coerce arguments.
     *
     * @private
     * @param {Function} func The function to apply a rest parameter to.
     * @param {number} [start=func.length-1] The start position of the rest parameter.
     * @returns {Function} Returns the new function.
     */
    function baseRest(func, start) {
      return _setToString(_overRest(func, start, identity_1), func + '');
    }

    var _baseRest = baseRest;

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike_1(value) && isArrayLike_1(value);
    }

    var isArrayLikeObject_1 = isArrayLikeObject;

    /**
     * Gets the last element of `array`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Array
     * @param {Array} array The array to query.
     * @returns {*} Returns the last element of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     */
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : undefined;
    }

    var last_1 = last;

    /**
     * This method is like `_.difference` except that it accepts `iteratee` which
     * is invoked for each element of `array` and `values` to generate the criterion
     * by which they're compared. The order and references of result values are
     * determined by the first array. The iteratee is invoked with one argument:
     * (value).
     *
     * **Note:** Unlike `_.pullAllBy`, this method returns a new array.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Array
     * @param {Array} array The array to inspect.
     * @param {...Array} [values] The values to exclude.
     * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
     * @returns {Array} Returns the new array of filtered values.
     * @example
     *
     * _.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
     * // => [1.2]
     *
     * // The `_.property` iteratee shorthand.
     * _.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
     * // => [{ 'x': 2 }]
     */
    var differenceBy = _baseRest(function(array, values) {
      var iteratee = last_1(values);
      if (isArrayLikeObject_1(iteratee)) {
        iteratee = undefined;
      }
      return isArrayLikeObject_1(array)
        ? _baseDifference(array, _baseFlatten(values, 1, isArrayLikeObject_1, true), _baseIteratee(iteratee))
        : [];
    });

    var differenceBy_1 = differenceBy;

    /* src\components\SelectTopics.svelte generated by Svelte v3.52.0 */
    const file$6 = "src\\components\\SelectTopics.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (25:4) {#each selected as topic}
    function create_each_block_1$1(ctx) {
    	let button;
    	let t_value = /*topic*/ ctx[6].name + "";
    	let t;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "topic button is-primary is-small svelte-1el4m8o");
    			button.disabled = button_disabled_value = /*loading*/ ctx[2] ? true : null;
    			add_location(button, file$6, 25, 6, 746);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button,
    						"click",
    						function () {
    							if (is_function(/*toggleTopicFunction*/ ctx[4](/*topic*/ ctx[6]))) /*toggleTopicFunction*/ ctx[4](/*topic*/ ctx[6]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button,
    						"keypress",
    						function () {
    							if (is_function(/*toggleTopicFunction*/ ctx[4](/*topic*/ ctx[6]))) /*toggleTopicFunction*/ ctx[4](/*topic*/ ctx[6]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*selected*/ 1 && t_value !== (t_value = /*topic*/ ctx[6].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*loading*/ 4 && button_disabled_value !== (button_disabled_value = /*loading*/ ctx[2] ? true : null)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(25:4) {#each selected as topic}",
    		ctx
    	});

    	return block;
    }

    // (34:4) {#each suggestions as topic}
    function create_each_block$1(ctx) {
    	let button;
    	let t0_value = /*topic*/ ctx[6].name + "";
    	let t0;
    	let t1;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	function func(...args) {
    		return /*func*/ ctx[5](/*topic*/ ctx[6], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(button, "class", "topic button is-small svelte-1el4m8o");
    			button.disabled = button_disabled_value = /*loading*/ ctx[2] ? true : null;
    			toggle_class(button, "is-primary", /*selected*/ ctx[0].find(func));
    			toggle_class(button, "is-loading", /*loading*/ ctx[2]);
    			add_location(button, file$6, 34, 6, 1037);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t0);
    			append_dev(button, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button,
    						"click",
    						function () {
    							if (is_function(/*toggleTopicFunction*/ ctx[4](/*topic*/ ctx[6]))) /*toggleTopicFunction*/ ctx[4](/*topic*/ ctx[6]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button,
    						"keypress",
    						function () {
    							if (is_function(/*toggleTopicFunction*/ ctx[4](/*topic*/ ctx[6]))) /*toggleTopicFunction*/ ctx[4](/*topic*/ ctx[6]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*suggestions*/ 8 && t0_value !== (t0_value = /*topic*/ ctx[6].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*loading*/ 4 && button_disabled_value !== (button_disabled_value = /*loading*/ ctx[2] ? true : null)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}

    			if (dirty & /*selected, suggestions*/ 9) {
    				toggle_class(button, "is-primary", /*selected*/ ctx[0].find(func));
    			}

    			if (dirty & /*loading*/ 4) {
    				toggle_class(button, "is-loading", /*loading*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(34:4) {#each suggestions as topic}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let debug_1;
    	let current;
    	let each_value_1 = /*selected*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*suggestions*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	debug_1 = new Debug({
    			props: {
    				label: "Topics",
    				data: {
    					selected: /*selected*/ ctx[0],
    					choices: /*topics*/ ctx[1]
    				}
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(debug_1.$$.fragment);
    			attr_dev(div0, "class", "topics svelte-1el4m8o");
    			toggle_class(div0, "loading", /*loading*/ ctx[2]);
    			add_location(div0, file$6, 23, 2, 673);
    			attr_dev(div1, "class", "select-topics");
    			add_location(div1, file$6, 22, 0, 642);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div0, t0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t1);
    			mount_component(debug_1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*loading, toggleTopicFunction, selected*/ 21) {
    				each_value_1 = /*selected*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, t0);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*loading, selected, suggestions, toggleTopicFunction*/ 29) {
    				each_value = /*suggestions*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*loading*/ 4) {
    				toggle_class(div0, "loading", /*loading*/ ctx[2]);
    			}

    			const debug_1_changes = {};

    			if (dirty & /*selected, topics*/ 3) debug_1_changes.data = {
    				selected: /*selected*/ ctx[0],
    				choices: /*topics*/ ctx[1]
    			};

    			debug_1.$set(debug_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(debug_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(debug_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			destroy_component(debug_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectTopics', slots, []);
    	let { selected } = $$props;
    	let { topics } = $$props;
    	let { loading = false } = $$props;
    	let suggestions;

    	const toggleTopicFunction = topic => {
    		return ev => {
    			ev.preventDefault();

    			if (selected.find(cur => cur.id === topic.id)) {
    				// remove topic
    				$$invalidate(0, selected = selected.filter(cur => cur.id !== topic.id));
    			} else {
    				// add to topics
    				$$invalidate(0, selected = [...selected, topic]);
    			}
    		};
    	};

    	$$self.$$.on_mount.push(function () {
    		if (selected === undefined && !('selected' in $$props || $$self.$$.bound[$$self.$$.props['selected']])) {
    			console.warn("<SelectTopics> was created without expected prop 'selected'");
    		}

    		if (topics === undefined && !('topics' in $$props || $$self.$$.bound[$$self.$$.props['topics']])) {
    			console.warn("<SelectTopics> was created without expected prop 'topics'");
    		}
    	});

    	const writable_props = ['selected', 'topics', 'loading'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectTopics> was created with unknown prop '${key}'`);
    	});

    	const func = (topic, cur) => cur.id === topic.id;

    	$$self.$$set = $$props => {
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('topics' in $$props) $$invalidate(1, topics = $$props.topics);
    		if ('loading' in $$props) $$invalidate(2, loading = $$props.loading);
    	};

    	$$self.$capture_state = () => ({
    		differenceBy: differenceBy_1,
    		Debug,
    		selected,
    		topics,
    		loading,
    		suggestions,
    		toggleTopicFunction
    	});

    	$$self.$inject_state = $$props => {
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('topics' in $$props) $$invalidate(1, topics = $$props.topics);
    		if ('loading' in $$props) $$invalidate(2, loading = $$props.loading);
    		if ('suggestions' in $$props) $$invalidate(3, suggestions = $$props.suggestions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*topics, selected*/ 3) {
    			$$invalidate(3, suggestions = differenceBy_1(topics, selected, "id"));
    		}
    	};

    	return [selected, topics, loading, suggestions, toggleTopicFunction, func];
    }

    class SelectTopics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { selected: 0, topics: 1, loading: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectTopics",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get selected() {
    		throw new Error("<SelectTopics>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<SelectTopics>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get topics() {
    		throw new Error("<SelectTopics>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topics(value) {
    		throw new Error("<SelectTopics>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loading() {
    		throw new Error("<SelectTopics>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loading(value) {
    		throw new Error("<SelectTopics>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Step-3_Topics.svelte generated by Svelte v3.52.0 */

    function create_fragment$6(ctx) {
    	let selecttopics;
    	let updating_selected;
    	let current;

    	function selecttopics_selected_binding(value) {
    		/*selecttopics_selected_binding*/ ctx[3](value);
    	}

    	let selecttopics_props = {
    		topics: /*topics*/ ctx[1],
    		loading: /*loading*/ ctx[2]
    	};

    	if (/*$query*/ ctx[0].topics !== void 0) {
    		selecttopics_props.selected = /*$query*/ ctx[0].topics;
    	}

    	selecttopics = new SelectTopics({
    			props: selecttopics_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(selecttopics, 'selected', selecttopics_selected_binding));

    	const block = {
    		c: function create() {
    			create_component(selecttopics.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(selecttopics, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const selecttopics_changes = {};
    			if (dirty & /*topics*/ 2) selecttopics_changes.topics = /*topics*/ ctx[1];
    			if (dirty & /*loading*/ 4) selecttopics_changes.loading = /*loading*/ ctx[2];

    			if (!updating_selected && dirty & /*$query*/ 1) {
    				updating_selected = true;
    				selecttopics_changes.selected = /*$query*/ ctx[0].topics;
    				add_flush_callback(() => updating_selected = false);
    			}

    			selecttopics.$set(selecttopics_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selecttopics.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selecttopics.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(selecttopics, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $query;
    	validate_store(query, 'query');
    	component_subscribe($$self, query, $$value => $$invalidate(0, $query = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Step_3_Topics', slots, []);
    	const navigate = useNavigate();
    	let topics = [];
    	let loading = false;

    	const updateTopics = async query => {
    		try {
    			$$invalidate(2, loading = true);
    			$$invalidate(1, topics = await getTopics("", query));
    		} finally {
    			$$invalidate(2, loading = false);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Step_3_Topics> was created with unknown prop '${key}'`);
    	});

    	function selecttopics_selected_binding(value) {
    		if ($$self.$$.not_equal($query.topics, value)) {
    			$query.topics = value;
    			query.set($query);
    		}
    	}

    	$$self.$capture_state = () => ({
    		query,
    		useNavigate,
    		getTopics,
    		SelectTopics,
    		navigate,
    		topics,
    		loading,
    		updateTopics,
    		$query
    	});

    	$$self.$inject_state = $$props => {
    		if ('topics' in $$props) $$invalidate(1, topics = $$props.topics);
    		if ('loading' in $$props) $$invalidate(2, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$query*/ 1) {
    			//   guard against no interests being selected
    			if ($query.categories.length <= 0) {
    				navigate("/interests");
    			}
    		}

    		if ($$self.$$.dirty & /*$query*/ 1) {
    			//   update available topics based on user selections
    			updateTopics($query);
    		}
    	};

    	return [$query, topics, loading, selecttopics_selected_binding];
    }

    class Step_3_Topics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Step_3_Topics",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\SelectHosts.svelte generated by Svelte v3.52.0 */
    const file$5 = "src\\components\\SelectHosts.svelte";

    function create_fragment$5(ctx) {
    	let code;
    	let t0_value = JSON.stringify({ filter: /*filter*/ ctx[1] }) + "";
    	let t0;
    	let t1;
    	let select;
    	let updating_filterText;
    	let current;

    	function select_filterText_binding(value) {
    		/*select_filterText_binding*/ ctx[4](value);
    	}

    	let select_props = {
    		items: /*hosts*/ ctx[2],
    		value: /*selected*/ ctx[0],
    		optionIdentifier,
    		labelIdentifier
    	};

    	if (/*filter*/ ctx[1] !== void 0) {
    		select_props.filterText = /*filter*/ ctx[1];
    	}

    	select = new Select({ props: select_props, $$inline: true });
    	binding_callbacks.push(() => bind(select, 'filterText', select_filterText_binding));
    	select.$on("select", /*onSelect*/ ctx[3]);

    	const block = {
    		c: function create() {
    			code = element("code");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(select.$$.fragment);
    			add_location(code, file$5, 11, 0, 264);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, code, anchor);
    			append_dev(code, t0);
    			insert_dev(target, t1, anchor);
    			mount_component(select, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*filter*/ 2) && t0_value !== (t0_value = JSON.stringify({ filter: /*filter*/ ctx[1] }) + "")) set_data_dev(t0, t0_value);
    			const select_changes = {};
    			if (dirty & /*hosts*/ 4) select_changes.items = /*hosts*/ ctx[2];
    			if (dirty & /*selected*/ 1) select_changes.value = /*selected*/ ctx[0];

    			if (!updating_filterText && dirty & /*filter*/ 2) {
    				updating_filterText = true;
    				select_changes.filterText = /*filter*/ ctx[1];
    				add_flush_callback(() => updating_filterText = false);
    			}

    			select.$set(select_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(select.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(select.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(code);
    			if (detaching) detach_dev(t1);
    			destroy_component(select, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const optionIdentifier = "id";
    const labelIdentifier = "name";

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectHosts', slots, []);
    	let { hosts } = $$props;
    	let { selected = [] } = $$props;
    	let { filter = "" } = $$props;

    	const onSelect = ev => {
    		$$invalidate(0, selected = ev.details);
    	};

    	$$self.$$.on_mount.push(function () {
    		if (hosts === undefined && !('hosts' in $$props || $$self.$$.bound[$$self.$$.props['hosts']])) {
    			console.warn("<SelectHosts> was created without expected prop 'hosts'");
    		}
    	});

    	const writable_props = ['hosts', 'selected', 'filter'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectHosts> was created with unknown prop '${key}'`);
    	});

    	function select_filterText_binding(value) {
    		filter = value;
    		$$invalidate(1, filter);
    	}

    	$$self.$$set = $$props => {
    		if ('hosts' in $$props) $$invalidate(2, hosts = $$props.hosts);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('filter' in $$props) $$invalidate(1, filter = $$props.filter);
    	};

    	$$self.$capture_state = () => ({
    		Select,
    		optionIdentifier,
    		labelIdentifier,
    		hosts,
    		selected,
    		filter,
    		onSelect
    	});

    	$$self.$inject_state = $$props => {
    		if ('hosts' in $$props) $$invalidate(2, hosts = $$props.hosts);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('filter' in $$props) $$invalidate(1, filter = $$props.filter);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected, filter, hosts, onSelect, select_filterText_binding];
    }

    class SelectHosts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { hosts: 2, selected: 0, filter: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectHosts",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get hosts() {
    		throw new Error("<SelectHosts>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hosts(value) {
    		throw new Error("<SelectHosts>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<SelectHosts>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<SelectHosts>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filter() {
    		throw new Error("<SelectHosts>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filter(value) {
    		throw new Error("<SelectHosts>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Step-3_Hosts.svelte generated by Svelte v3.52.0 */
    const file$4 = "src\\pages\\Step-3_Hosts.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let selecthosts;
    	let updating_selected;
    	let current;

    	function selecthosts_selected_binding(value) {
    		/*selecthosts_selected_binding*/ ctx[2](value);
    	}

    	let selecthosts_props = { hosts: /*hosts*/ ctx[1] };

    	if (/*$query*/ ctx[0].clients !== void 0) {
    		selecthosts_props.selected = /*$query*/ ctx[0].clients;
    	}

    	selecthosts = new SelectHosts({ props: selecthosts_props, $$inline: true });
    	binding_callbacks.push(() => bind(selecthosts, 'selected', selecthosts_selected_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(selecthosts.$$.fragment);
    			attr_dev(div, "class", "select-hosts");
    			add_location(div, file$4, 10, 0, 300);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(selecthosts, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const selecthosts_changes = {};

    			if (!updating_selected && dirty & /*$query*/ 1) {
    				updating_selected = true;
    				selecthosts_changes.selected = /*$query*/ ctx[0].clients;
    				add_flush_callback(() => updating_selected = false);
    			}

    			selecthosts.$set(selecthosts_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selecthosts.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selecthosts.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(selecthosts);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $query;
    	validate_store(query, 'query');
    	component_subscribe($$self, query, $$value => $$invalidate(0, $query = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Step_3_Hosts', slots, []);
    	const navigate = useNavigate();
    	let hosts = [];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Step_3_Hosts> was created with unknown prop '${key}'`);
    	});

    	function selecthosts_selected_binding(value) {
    		if ($$self.$$.not_equal($query.clients, value)) {
    			$query.clients = value;
    			query.set($query);
    		}
    	}

    	$$self.$capture_state = () => ({
    		query,
    		useNavigate,
    		SelectHosts,
    		navigate,
    		hosts,
    		$query
    	});

    	$$self.$inject_state = $$props => {
    		if ('hosts' in $$props) $$invalidate(1, hosts = $$props.hosts);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$query*/ 1) {
    			if ($query.categories.length <= 0) {
    				navigate("/interests");
    			}
    		}
    	};

    	return [$query, hosts, selecthosts_selected_binding];
    }

    class Step_3_Hosts extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Step_3_Hosts",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Supervisor.svelte generated by Svelte v3.52.0 */
    const file$3 = "src\\components\\Supervisor.svelte";

    // (24:2) {#if details}
    function create_if_block_1(ctx) {
    	let div;
    	let t_value = /*details*/ ctx[1]?.organizations.map(func).join(", ") + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "department");
    			add_location(div, file$3, 24, 4, 847);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*details*/ 2 && t_value !== (t_value = /*details*/ ctx[1]?.organizations.map(func).join(", ") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(24:2) {#if details}",
    		ctx
    	});

    	return block;
    }

    // (29:2) {#if supervisor.mail != "NA"}
    function create_if_block(ctx) {
    	let div;
    	let a;
    	let t_value = /*supervisor*/ ctx[0].mail + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = "mailto:" + /*supervisor*/ ctx[0].mail);
    			add_location(a, file$3, 30, 6, 1036);
    			attr_dev(div, "class", "contact");
    			add_location(div, file$3, 29, 4, 1007);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*supervisor*/ 1 && t_value !== (t_value = /*supervisor*/ ctx[0].mail + "")) set_data_dev(t, t_value);

    			if (dirty & /*supervisor*/ 1 && a_href_value !== (a_href_value = "mailto:" + /*supervisor*/ ctx[0].mail)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(29:2) {#if supervisor.mail != \\\"NA\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;
    	let t0_value = (/*details*/ ctx[1]?.name || /*supervisor*/ ctx[0].name) + "";
    	let t0;
    	let t1;
    	let t2_value = /*details*/ ctx[1]?.givenName + "";
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let debug_1;
    	let current;
    	let if_block0 = /*details*/ ctx[1] && create_if_block_1(ctx);
    	let if_block1 = /*supervisor*/ ctx[0].mail != "NA" && create_if_block(ctx);

    	debug_1 = new Debug({
    			props: {
    				label: "details",
    				data: {
    					supervisor: /*supervisor*/ ctx[0],
    					details: /*details*/ ctx[1]
    				}
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = text(" (");
    			t2 = text(t2_value);
    			t3 = text(")");
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			create_component(debug_1.$$.fragment);
    			attr_dev(div0, "class", "name");
    			add_location(div0, file$3, 20, 2, 733);
    			attr_dev(div1, "class", "supervisor");
    			add_location(div1, file$3, 19, 0, 705);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div1, t4);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t5);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t6);
    			mount_component(debug_1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*details, supervisor*/ 3) && t0_value !== (t0_value = (/*details*/ ctx[1]?.name || /*supervisor*/ ctx[0].name) + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*details*/ 2) && t2_value !== (t2_value = /*details*/ ctx[1]?.givenName + "")) set_data_dev(t2, t2_value);

    			if (/*details*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t5);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*supervisor*/ ctx[0].mail != "NA") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(div1, t6);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			const debug_1_changes = {};

    			if (dirty & /*supervisor, details*/ 3) debug_1_changes.data = {
    				supervisor: /*supervisor*/ ctx[0],
    				details: /*details*/ ctx[1]
    			};

    			debug_1.$set(debug_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(debug_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(debug_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_component(debug_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = org => org.organizationId;

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Supervisor', slots, []);
    	let { supervisor } = $$props;
    	let details;

    	async function fetchDetails(supervisor) {
    		let response = await fetch(`https://people.utwente.nl/peoplepagesopenapi/contacts?query=${encodeURIComponent(supervisor.mail)}`);
    		let data = await response.json();

    		if ((data === null || data === void 0 ? void 0 : data.data) && data.data.length >= 1) {
    			$$invalidate(1, details = data.data[0]);
    		}
    	}

    	let interests = [];

    	async function fetchInterests(supervisor) {
    		interests = await getCategories("", { tutors: [supervisor] });
    	}

    	$$self.$$.on_mount.push(function () {
    		if (supervisor === undefined && !('supervisor' in $$props || $$self.$$.bound[$$self.$$.props['supervisor']])) {
    			console.warn("<Supervisor> was created without expected prop 'supervisor'");
    		}
    	});

    	const writable_props = ['supervisor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Supervisor> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('supervisor' in $$props) $$invalidate(0, supervisor = $$props.supervisor);
    	};

    	$$self.$capture_state = () => ({
    		getCategories,
    		Debug,
    		supervisor,
    		details,
    		fetchDetails,
    		interests,
    		fetchInterests
    	});

    	$$self.$inject_state = $$props => {
    		if ('supervisor' in $$props) $$invalidate(0, supervisor = $$props.supervisor);
    		if ('details' in $$props) $$invalidate(1, details = $$props.details);
    		if ('interests' in $$props) interests = $$props.interests;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*supervisor*/ 1) {
    			fetchDetails(supervisor);
    		}

    		if ($$self.$$.dirty & /*supervisor*/ 1) {
    			fetchInterests(supervisor);
    		}
    	};

    	return [supervisor, details];
    }

    class Supervisor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { supervisor: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Supervisor",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get supervisor() {
    		throw new Error("<Supervisor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set supervisor(value) {
    		throw new Error("<Supervisor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SelectSupervisors.svelte generated by Svelte v3.52.0 */
    const file$2 = "src\\components\\SelectSupervisors.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (17:2) {#each $query.tutors as supervisor}
    function create_each_block_1(ctx) {
    	let supervisor;
    	let current;

    	supervisor = new Supervisor({
    			props: { supervisor: /*supervisor*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(supervisor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(supervisor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const supervisor_changes = {};
    			if (dirty & /*$query*/ 1) supervisor_changes.supervisor = /*supervisor*/ ctx[5];
    			supervisor.$set(supervisor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(supervisor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(supervisor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(supervisor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(17:2) {#each $query.tutors as supervisor}",
    		ctx
    	});

    	return block;
    }

    // (20:2) {#each suggestions as supervisor}
    function create_each_block(ctx) {
    	let supervisor;
    	let current;

    	supervisor = new Supervisor({
    			props: { supervisor: /*supervisor*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(supervisor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(supervisor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const supervisor_changes = {};
    			if (dirty & /*suggestions*/ 2) supervisor_changes.supervisor = /*supervisor*/ ctx[5];
    			supervisor.$set(supervisor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(supervisor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(supervisor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(supervisor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(20:2) {#each suggestions as supervisor}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let t;
    	let current;
    	let each_value_1 = /*$query*/ ctx[0].tutors;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*suggestions*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "select-supervisors");
    			add_location(div, file$2, 15, 0, 477);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div, null);
    			}

    			append_dev(div, t);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$query*/ 1) {
    				each_value_1 = /*$query*/ ctx[0].tutors;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div, t);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*suggestions*/ 2) {
    				each_value = /*suggestions*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $query;
    	validate_store(query, 'query');
    	component_subscribe($$self, query, $$value => $$invalidate(0, $query = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectSupervisors', slots, []);
    	let supervisors;
    	let filter = "";
    	let suggestions = [];

    	async function updateChoices(query) {
    		$$invalidate(2, supervisors = await getTutors(filter, query));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectSupervisors> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getTutors,
    		query,
    		differenceBy: differenceBy_1,
    		Supervisor,
    		supervisors,
    		filter,
    		suggestions,
    		updateChoices,
    		$query
    	});

    	$$self.$inject_state = $$props => {
    		if ('supervisors' in $$props) $$invalidate(2, supervisors = $$props.supervisors);
    		if ('filter' in $$props) filter = $$props.filter;
    		if ('suggestions' in $$props) $$invalidate(1, suggestions = $$props.suggestions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*supervisors, $query*/ 5) {
    			$$invalidate(1, suggestions = differenceBy_1(supervisors, $query.tutors, "id"));
    		}

    		if ($$self.$$.dirty & /*$query*/ 1) {
    			updateChoices($query);
    		}
    	};

    	return [$query, suggestions, supervisors];
    }

    class SelectSupervisors extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectSupervisors",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\Step-3_Supervisors.svelte generated by Svelte v3.52.0 */
    const file$1 = "src\\pages\\Step-3_Supervisors.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let h4;
    	let t1;
    	let selectsupervisors;
    	let current;
    	selectsupervisors = new SelectSupervisors({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			h4 = element("h4");
    			h4.textContent = "Find your supervisor...";
    			t1 = space();
    			create_component(selectsupervisors.$$.fragment);
    			attr_dev(h4, "class", "title is-size-6");
    			add_location(h4, file$1, 10, 2, 331);
    			attr_dev(div, "class", "under-construction");
    			add_location(div, file$1, 9, 0, 295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h4);
    			append_dev(div, t1);
    			mount_component(selectsupervisors, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectsupervisors.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectsupervisors.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(selectsupervisors);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $query;
    	validate_store(query, 'query');
    	component_subscribe($$self, query, $$value => $$invalidate(0, $query = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Step_3_Supervisors', slots, []);
    	const navigate = useNavigate();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Step_3_Supervisors> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		query,
    		useNavigate,
    		SelectSupervisors,
    		navigate,
    		$query
    	});

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$query*/ 1) {
    			if ($query.categories.length <= 0) {
    				navigate("/interests");
    			}
    		}
    	};

    	return [$query];
    }

    class Step_3_Supervisors extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Step_3_Supervisors",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.52.0 */
    const file = "src\\App.svelte";

    // (23:12) <Route path="/">
    function create_default_slot_5(ctx) {
    	let h2;
    	let t1;
    	let step1;
    	let current;
    	step1 = new Step_1({ $$inline: true });

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Step 1: Select your study programme";
    			t1 = space();
    			create_component(step1.$$.fragment);
    			attr_dev(h2, "class", "title is-size-4");
    			add_location(h2, file, 23, 16, 909);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(step1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(step1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(step1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			destroy_component(step1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(23:12) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:12) <Route path="/interests">
    function create_default_slot_4(ctx) {
    	let h2;
    	let t1;
    	let step2;
    	let current;
    	step2 = new Step_2({ $$inline: true });

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Step 2: Choose your interests";
    			t1 = space();
    			create_component(step2.$$.fragment);
    			attr_dev(h2, "class", "title is-size-4");
    			add_location(h2, file, 29, 16, 1123);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(step2, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(step2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(step2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			destroy_component(step2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(29:12) <Route path=\\\"/interests\\\">",
    		ctx
    	});

    	return block;
    }

    // (33:12) <Route path="/supervisors">
    function create_default_slot_3(ctx) {
    	let h2;
    	let t1;
    	let step3_supervisors;
    	let current;
    	step3_supervisors = new Step_3_Supervisors({ $$inline: true });

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Step 3: Find a supervisor";
    			t1 = space();
    			create_component(step3_supervisors.$$.fragment);
    			attr_dev(h2, "class", "title is-size-4");
    			add_location(h2, file, 33, 16, 1293);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(step3_supervisors, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(step3_supervisors.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(step3_supervisors.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			destroy_component(step3_supervisors, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(33:12) <Route path=\\\"/supervisors\\\">",
    		ctx
    	});

    	return block;
    }

    // (37:12) <Route path="/topics">
    function create_default_slot_2(ctx) {
    	let h2;
    	let t1;
    	let step3_topics;
    	let current;
    	step3_topics = new Step_3_Topics({ $$inline: true });

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Step 3: Find a topic";
    			t1 = space();
    			create_component(step3_topics.$$.fragment);
    			attr_dev(h2, "class", "title is-size-4");
    			add_location(h2, file, 37, 16, 1466);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(step3_topics, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(step3_topics.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(step3_topics.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			destroy_component(step3_topics, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(37:12) <Route path=\\\"/topics\\\">",
    		ctx
    	});

    	return block;
    }

    // (41:12) <Route path="/hosts">
    function create_default_slot_1(ctx) {
    	let h2;
    	let t1;
    	let step3_hosts;
    	let current;
    	step3_hosts = new Step_3_Hosts({ $$inline: true });

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Step 3: Find a host";
    			t1 = space();
    			create_component(step3_hosts.$$.fragment);
    			attr_dev(h2, "class", "title is-size-4");
    			add_location(h2, file, 41, 16, 1628);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(step3_hosts, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(step3_hosts.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(step3_hosts.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			destroy_component(step3_hosts, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(41:12) <Route path=\\\"/hosts\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:4) <Router>
    function create_default_slot(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let breadcrumbs_1;
    	let t2;
    	let div0;
    	let debug_1;
    	let t3;
    	let route0;
    	let t4;
    	let route1;
    	let t5;
    	let route2;
    	let t6;
    	let route3;
    	let t7;
    	let route4;
    	let current;

    	breadcrumbs_1 = new Breadcrumbs({
    			props: { items: /*$breadcrumbs*/ ctx[0] },
    			$$inline: true
    		});

    	debug_1 = new Debug({
    			props: {
    				label: "State",
    				data: {
    					query: /*$query*/ ctx[1],
    					breadcrumbs: /*$breadcrumbs*/ ctx[0]
    				}
    			},
    			$$inline: true
    		});

    	route0 = new Route$1({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "/interests",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "/supervisors",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: "/topics",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route$1({
    			props: {
    				path: "/hosts",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "STEERS";
    			t1 = space();
    			create_component(breadcrumbs_1.$$.fragment);
    			t2 = space();
    			div0 = element("div");
    			create_component(debug_1.$$.fragment);
    			t3 = space();
    			create_component(route0.$$.fragment);
    			t4 = space();
    			create_component(route1.$$.fragment);
    			t5 = space();
    			create_component(route2.$$.fragment);
    			t6 = space();
    			create_component(route3.$$.fragment);
    			t7 = space();
    			create_component(route4.$$.fragment);
    			attr_dev(h1, "class", "title");
    			add_location(h1, file, 14, 12, 578);
    			attr_dev(div0, "class", "flex");
    			add_location(div0, file, 16, 12, 671);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file, 13, 8, 541);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			mount_component(breadcrumbs_1, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			mount_component(debug_1, div0, null);
    			append_dev(div1, t3);
    			mount_component(route0, div1, null);
    			append_dev(div1, t4);
    			mount_component(route1, div1, null);
    			append_dev(div1, t5);
    			mount_component(route2, div1, null);
    			append_dev(div1, t6);
    			mount_component(route3, div1, null);
    			append_dev(div1, t7);
    			mount_component(route4, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const breadcrumbs_1_changes = {};
    			if (dirty & /*$breadcrumbs*/ 1) breadcrumbs_1_changes.items = /*$breadcrumbs*/ ctx[0];
    			breadcrumbs_1.$set(breadcrumbs_1_changes);
    			const debug_1_changes = {};

    			if (dirty & /*$query, $breadcrumbs*/ 3) debug_1_changes.data = {
    				query: /*$query*/ ctx[1],
    				breadcrumbs: /*$breadcrumbs*/ ctx[0]
    			};

    			debug_1.$set(debug_1_changes);
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(breadcrumbs_1.$$.fragment, local);
    			transition_in(debug_1.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(breadcrumbs_1.$$.fragment, local);
    			transition_out(debug_1.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(breadcrumbs_1);
    			destroy_component(debug_1);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(13:4) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let section;
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(router.$$.fragment);
    			add_location(section, file, 11, 0, 508);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(router, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, $query, $breadcrumbs*/ 7) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $breadcrumbs;
    	let $query;
    	validate_store(breadcrumbs, 'breadcrumbs');
    	component_subscribe($$self, breadcrumbs, $$value => $$invalidate(0, $breadcrumbs = $$value));
    	validate_store(query, 'query');
    	component_subscribe($$self, query, $$value => $$invalidate(1, $query = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router: Router$1,
    		Route: Route$1,
    		query,
    		breadcrumbs,
    		Breadcrumbs,
    		Step1: Step_1,
    		Step2: Step_2,
    		Step3_Topics: Step_3_Topics,
    		Step3_Hosts: Step_3_Hosts,
    		Step3_Supervisors: Step_3_Supervisors,
    		Debug,
    		$breadcrumbs,
    		$query
    	});

    	return [$breadcrumbs, $query];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
