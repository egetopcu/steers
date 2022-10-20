
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
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
    function null_to_empty(value) {
        return value == null ? '' : value;
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
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
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

    /* src\components\ChooseGoal.svelte generated by Svelte v3.52.0 */

    const file$p = "src\\components\\ChooseGoal.svelte";

    function create_fragment$s(ctx) {
    	let div1;
    	let label;
    	let t1;
    	let div0;
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
    			div1 = element("div");
    			label = element("label");
    			label.textContent = "What are you looking for?";
    			t1 = space();
    			div0 = element("div");
    			button0 = element("button");
    			t2 = text("Supervisor(s)");
    			t3 = space();
    			button1 = element("button");
    			t4 = text("Topic");
    			t5 = space();
    			button2 = element("button");
    			t6 = text("Host organization");
    			attr_dev(label, "for", "goal-choices");
    			add_location(label, file$p, 5, 4, 126);
    			attr_dev(button0, "class", "choice svelte-5q6pml");
    			button0.disabled = button0_disabled_value = !/*enabled*/ ctx[1];
    			add_location(button0, file$p, 7, 8, 240);
    			attr_dev(button1, "class", "choice svelte-5q6pml");
    			button1.disabled = button1_disabled_value = !/*enabled*/ ctx[1];
    			add_location(button1, file$p, 14, 8, 427);
    			attr_dev(button2, "class", "choice svelte-5q6pml");
    			button2.disabled = button2_disabled_value = !/*enabled*/ ctx[1];
    			add_location(button2, file$p, 21, 8, 601);
    			attr_dev(div0, "id", "goal-choices");
    			attr_dev(div0, "class", "choices svelte-5q6pml");
    			add_location(div0, file$p, 6, 4, 191);
    			attr_dev(div1, "class", "goal-container container");
    			add_location(div1, file$p, 4, 0, 82);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(button1, t4);
    			append_dev(div0, t5);
    			append_dev(div0, button2);
    			append_dev(button2, t6);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[3], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*enabled*/ 2 && button0_disabled_value !== (button0_disabled_value = !/*enabled*/ ctx[1])) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (dirty & /*enabled*/ 2 && button1_disabled_value !== (button1_disabled_value = !/*enabled*/ ctx[1])) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (dirty & /*enabled*/ 2 && button2_disabled_value !== (button2_disabled_value = !/*enabled*/ ctx[1])) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ChooseGoal', slots, []);
    	let { goal = undefined } = $$props;
    	let { enabled } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (enabled === undefined && !('enabled' in $$props || $$self.$$.bound[$$self.$$.props['enabled']])) {
    			console.warn("<ChooseGoal> was created without expected prop 'enabled'");
    		}
    	});

    	const writable_props = ['goal', 'enabled'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ChooseGoal> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, goal = "supervisor");
    	const click_handler_1 = () => $$invalidate(0, goal = "topic");
    	const click_handler_2 = () => $$invalidate(0, goal = "client");

    	$$self.$$set = $$props => {
    		if ('goal' in $$props) $$invalidate(0, goal = $$props.goal);
    		if ('enabled' in $$props) $$invalidate(1, enabled = $$props.enabled);
    	};

    	$$self.$capture_state = () => ({ goal, enabled });

    	$$self.$inject_state = $$props => {
    		if ('goal' in $$props) $$invalidate(0, goal = $$props.goal);
    		if ('enabled' in $$props) $$invalidate(1, enabled = $$props.enabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [goal, enabled, click_handler, click_handler_1, click_handler_2];
    }

    class ChooseGoal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { goal: 0, enabled: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ChooseGoal",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get goal() {
    		throw new Error("<ChooseGoal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set goal(value) {
    		throw new Error("<ChooseGoal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get enabled() {
    		throw new Error("<ChooseGoal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enabled(value) {
    		throw new Error("<ChooseGoal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

    const file$o = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\Item.svelte";

    function create_fragment$r(ctx) {
    	let div;
    	let raw_value = /*getOptionLabel*/ ctx[0](/*item*/ ctx[1], /*filterText*/ ctx[2]) + "";
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "item " + /*itemClasses*/ ctx[3] + " svelte-3e0qet");
    			add_location(div, file$o, 78, 0, 1837);
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
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
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
    			id: create_fragment$r.name
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
    const file$n = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\List.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    // (309:4) {:else}
    function create_else_block$4(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
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
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
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
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(309:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (286:4) {#if isVirtualList}
    function create_if_block$d(ctx) {
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
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(286:4) {#if isVirtualList}",
    		ctx
    	});

    	return block;
    }

    // (331:8) {:else}
    function create_else_block_2(ctx) {
    	let if_block_anchor;
    	let if_block = !/*hideEmptyState*/ ctx[11] && create_if_block_2$5(ctx);

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
    					if_block = create_if_block_2$5(ctx);
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
    function create_if_block_2$5(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*noOptionsMessage*/ ctx[12]);
    			attr_dev(div, "class", "empty svelte-1uyqfml");
    			add_location(div, file$n, 332, 16, 10333);
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
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(332:12) {#if !hideEmptyState}",
    		ctx
    	});

    	return block;
    }

    // (313:12) {:else}
    function create_else_block_1$1(ctx) {
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
    			add_location(div, file$n, 313, 16, 9513);
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
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(313:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (311:12) {#if item.isGroupHeader && !item.isSelectable}
    function create_if_block_1$7(ctx) {
    	let div;
    	let t_value = /*getGroupHeaderLabel*/ ctx[7](/*item*/ ctx[41]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "listGroupTitle svelte-1uyqfml");
    			add_location(div, file$n, 311, 16, 9415);
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
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(311:12) {#if item.isGroupHeader && !item.isSelectable}",
    		ctx
    	});

    	return block;
    }

    // (310:8) {#each items as item, i}
    function create_each_block$8(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$7, create_else_block_1$1];
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
    		id: create_each_block$8.name,
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
    			add_location(div, file$n, 292, 12, 8621);
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

    function create_fragment$q(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$d, create_else_block$4];
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
    			add_location(div, file$n, 280, 0, 8325);
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
    		id: create_fragment$q.name,
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

    function instance$q($$self, $$props, $$invalidate) {
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
    			instance$q,
    			create_fragment$q,
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
    			id: create_fragment$q.name
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

    const file$m = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\Selection.svelte";

    function create_fragment$p(ctx) {
    	let div;
    	let raw_value = /*getSelectionLabel*/ ctx[0](/*item*/ ctx[1]) + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "selection svelte-pu1q1n");
    			add_location(div, file$m, 13, 0, 230);
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
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { getSelectionLabel: 0, item: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Selection",
    			options,
    			id: create_fragment$p.name
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
    const file$l = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\MultiSelection.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (87:8) {#if !isDisabled && !multiFullItemClearable}
    function create_if_block$c(ctx) {
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
    			add_location(path, file$l, 97, 20, 3027);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "-2 -2 50 50");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "role", "presentation");
    			attr_dev(svg, "class", "svelte-liu9pa");
    			add_location(svg, file$l, 90, 16, 2775);
    			attr_dev(div, "class", "multiSelectItem_clear svelte-liu9pa");
    			add_location(div, file$l, 87, 12, 2647);
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
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(87:8) {#if !isDisabled && !multiFullItemClearable}",
    		ctx
    	});

    	return block;
    }

    // (77:0) {#each value as item, i}
    function create_each_block$7(ctx) {
    	let div1;
    	let div0;
    	let raw_value = /*getSelectionLabel*/ ctx[4](/*item*/ ctx[9]) + "";
    	let t0;
    	let t1;
    	let div1_class_value;
    	let mounted;
    	let dispose;
    	let if_block = !/*isDisabled*/ ctx[2] && !/*multiFullItemClearable*/ ctx[3] && create_if_block$c(ctx);

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
    			add_location(div0, file$l, 83, 8, 2487);
    			attr_dev(div1, "class", div1_class_value = "multiSelectItem " + (/*activeValue*/ ctx[1] === /*i*/ ctx[11] ? 'active' : '') + " " + (/*isDisabled*/ ctx[2] ? 'disabled' : '') + " svelte-liu9pa");
    			add_location(div1, file$l, 77, 4, 2256);
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
    					if_block = create_if_block$c(ctx);
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
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(77:0) {#each value as item, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let each_1_anchor;
    	let each_value = /*value*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
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
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
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
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
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
    			id: create_fragment$o.name
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
    const file$k = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\VirtualList.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    const get_default_slot_changes$1 = dirty => ({
    	item: dirty & /*visible*/ 32,
    	i: dirty & /*visible*/ 32,
    	hoverItemIndex: dirty & /*hoverItemIndex*/ 2
    });

    const get_default_slot_context$1 = ctx => ({
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
    function create_each_block$6(key_1, ctx) {
    	let svelte_virtual_list_row;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context$1);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			svelte_virtual_list_row = element("svelte-virtual-list-row");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t = space();
    			set_custom_element_data(svelte_virtual_list_row, "class", "svelte-g2cagw");
    			add_location(svelte_virtual_list_row, file$k, 152, 12, 3778);
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
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
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
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(152:8) {#each visible as row (row.index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
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
    	validate_each_keys(ctx, each_value, get_each_context$6, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$6(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$6(key, child_ctx));
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
    			add_location(svelte_virtual_list_contents, file$k, 148, 4, 3597);
    			set_style(svelte_virtual_list_viewport, "height", /*height*/ ctx[0]);
    			set_custom_element_data(svelte_virtual_list_viewport, "class", "svelte-g2cagw");
    			add_render_callback(() => /*svelte_virtual_list_viewport_elementresize_handler*/ ctx[18].call(svelte_virtual_list_viewport));
    			add_location(svelte_virtual_list_viewport, file$k, 143, 0, 3437);
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
    				validate_each_keys(ctx, each_value, get_each_context$6, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, svelte_virtual_list_contents, outro_and_destroy_block, create_each_block$6, null, get_each_context$6);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
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

    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {
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
    			id: create_fragment$n.name
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

    const file$j = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\ClearIcon.svelte";

    function create_fragment$m(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124\n    l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z");
    			add_location(path, file$j, 8, 4, 141);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "-2 -2 50 50");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "role", "presentation");
    			add_location(svg, file$j, 0, 0, 0);
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
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props) {
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
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClearIcon",
    			options,
    			id: create_fragment$m.name
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

    const { Object: Object_1, console: console_1$3 } = globals;
    const file$i = "..\\node_modules\\.pnpm\\svelte-select@4.4.7\\node_modules\\svelte-select\\src\\Select.svelte";

    function get_each_context$5(ctx, list, i) {
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
    			add_location(span0, file$i, 876, 12, 23842);
    			attr_dev(span1, "id", "aria-context");
    			add_location(span1, file$i, 877, 12, 23903);
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
    			add_location(div, file$i, 910, 8, 24725);
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
    function create_if_block_6$1(ctx) {
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
    			add_location(div, file$i, 919, 8, 24964);
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
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(919:4) {#if showClearIcon}",
    		ctx
    	});

    	return block;
    }

    // (928:4) {#if !showClearIcon && (showIndicator || (showChevron && !value) || (!isSearchable && !isDisabled && !isWaiting && ((showSelectedItem && !isClearable) || !showSelectedItem)))}
    function create_if_block_4$2(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*indicatorSvg*/ ctx[22]) return create_if_block_5$1;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "indicator svelte-17l1npl");
    			attr_dev(div, "aria-hidden", "true");
    			add_location(div, file$i, 928, 8, 25347);
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
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(928:4) {#if !showClearIcon && (showIndicator || (showChevron && !value) || (!isSearchable && !isDisabled && !isWaiting && ((showSelectedItem && !isClearable) || !showSelectedItem)))}",
    		ctx
    	});

    	return block;
    }

    // (932:12) {:else}
    function create_else_block$3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747\n          3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0\n          1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502\n          0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0\n          0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z");
    			add_location(path, file$i, 938, 20, 25704);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", "svelte-17l1npl");
    			add_location(svg, file$i, 932, 16, 25494);
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
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(932:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (930:12) {#if indicatorSvg}
    function create_if_block_5$1(ctx) {
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
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(930:12) {#if indicatorSvg}",
    		ctx
    	});

    	return block;
    }

    // (950:4) {#if isWaiting}
    function create_if_block_3$2(ctx) {
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
    			add_location(circle, file$i, 952, 16, 26253);
    			attr_dev(svg, "class", "spinner_icon svelte-17l1npl");
    			attr_dev(svg, "viewBox", "25 25 50 50");
    			add_location(svg, file$i, 951, 12, 26188);
    			attr_dev(div, "class", "spinner svelte-17l1npl");
    			add_location(div, file$i, 950, 8, 26154);
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
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(950:4) {#if isWaiting}",
    		ctx
    	});

    	return block;
    }

    // (966:4) {#if listOpen}
    function create_if_block_2$4(ctx) {
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
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(966:4) {#if listOpen}",
    		ctx
    	});

    	return block;
    }

    // (976:4) {#if !isMulti || (isMulti && !showMultiSelect)}
    function create_if_block_1$6(ctx) {
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
    			add_location(input_1, file$i, 976, 8, 26910);
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
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(976:4) {#if !isMulti || (isMulti && !showMultiSelect)}",
    		ctx
    	});

    	return block;
    }

    // (983:4) {#if isMulti && showMultiSelect}
    function create_if_block$b(ctx) {
    	let each_1_anchor;
    	let each_value = /*value*/ ctx[2];
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
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(983:4) {#if isMulti && showMultiSelect}",
    		ctx
    	});

    	return block;
    }

    // (984:8) {#each value as item}
    function create_each_block$5(ctx) {
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
    			add_location(input_1, file$i, 984, 12, 27136);
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
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(984:8) {#each value as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
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
    	let if_block4 = /*showClearIcon*/ ctx[37] && create_if_block_6$1(ctx);
    	let if_block5 = !/*showClearIcon*/ ctx[37] && (/*showIndicator*/ ctx[20] || /*showChevron*/ ctx[19] && !/*value*/ ctx[2] || !/*isSearchable*/ ctx[13] && !/*isDisabled*/ ctx[9] && !/*isWaiting*/ ctx[4] && (/*showSelectedItem*/ ctx[29] && !/*isClearable*/ ctx[15] || !/*showSelectedItem*/ ctx[29])) && create_if_block_4$2(ctx);
    	let if_block6 = /*isWaiting*/ ctx[4] && create_if_block_3$2(ctx);
    	let if_block7 = /*listOpen*/ ctx[5] && create_if_block_2$4(ctx);
    	let if_block8 = (!/*isMulti*/ ctx[7] || /*isMulti*/ ctx[7] && !/*showMultiSelect*/ ctx[35]) && create_if_block_1$6(ctx);
    	let if_block9 = /*isMulti*/ ctx[7] && /*showMultiSelect*/ ctx[35] && create_if_block$b(ctx);

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
    			add_location(span, file$i, 870, 4, 23680);
    			set_attributes(input_1, input_1_data);
    			toggle_class(input_1, "svelte-17l1npl", true);
    			add_location(input_1, file$i, 899, 4, 24419);
    			attr_dev(div, "class", div_class_value = "selectContainer " + /*containerClasses*/ ctx[21] + " svelte-17l1npl");
    			attr_dev(div, "style", /*containerStyles*/ ctx[11]);
    			toggle_class(div, "hasError", /*hasError*/ ctx[10]);
    			toggle_class(div, "multiSelect", /*isMulti*/ ctx[7]);
    			toggle_class(div, "disabled", /*isDisabled*/ ctx[9]);
    			toggle_class(div, "focused", /*isFocused*/ ctx[1]);
    			add_location(div, file$i, 861, 0, 23429);
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
    					if_block4 = create_if_block_6$1(ctx);
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
    					if_block5 = create_if_block_4$2(ctx);
    					if_block5.c();
    					if_block5.m(div, t6);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*isWaiting*/ ctx[4]) {
    				if (if_block6) ; else {
    					if_block6 = create_if_block_3$2(ctx);
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
    					if_block7 = create_if_block_2$4(ctx);
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
    					if_block8 = create_if_block_1$6(ctx);
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
    					if_block9 = create_if_block$b(ctx);
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
    		id: create_fragment$l.name,
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

    function instance$l($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Select> was created with unknown prop '${key}'`);
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
    			instance$l,
    			create_fragment$l,
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
    			id: create_fragment$l.name
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
    async function getCategories(filter, programme) {
        const url = new URL("categories", API_BASE);
        url.searchParams.set("q", filter);
        url.searchParams.set("programme", programme);
        return await fetch(url.toString()).then((result) => result.json());
    }
    async function getProgrammes(filter) {
        const url = new URL("programmes", API_BASE);
        url.searchParams.set("q", filter);
        return await fetch(url.toString()).then((result) => result.json());
    }
    async function getClients(filter, programme, categories, topics, tutors) {
        const url = new URL("clients", API_BASE);
        url.searchParams.set("q", filter);
        url.searchParams.set("programme", programme);
        for (const category of categories) {
            url.searchParams.append("categories", category);
        }
        for (const topic of topics) {
            url.searchParams.append("topics", topic);
        }
        for (const tutor of tutors) {
            url.searchParams.append("tutors", tutor);
        }
        return await fetch(url.toString()).then((result) => result.json());
    }
    async function getTutors(filter, programme, categories, topics, client) {
        return [];
    }
    async function getTopics(filter, programme, categories, tutors, client) {
        const url = new URL("topics", API_BASE);
        url.searchParams.set("q", filter);
        url.searchParams.set("programme", programme);
        for (const category of categories) {
            url.searchParams.append("categories", category);
        }
        for (const tutor of tutors) {
            url.searchParams.append("tutors", tutor);
        }
        if (client) {
            url.searchParams.set("client", client);
        }
        return await fetch(url.toString()).then((result) => result.json());
    }
    async function getEssays(programme, categories, topics, tutors, client) {
        const url = new URL("essays", API_BASE);
        url.searchParams.set("programme", programme);
        for (const category of categories) {
            url.searchParams.append("categories", category);
        }
        for (const tutor of tutors) {
            url.searchParams.append("tutors", tutor);
        }
        if (client) {
            url.searchParams.set("client", client);
        }
        for (const topic of topics) {
            url.searchParams.append("topics", topic);
        }
        return await fetch(url.toString()).then((result) => result.json());
    }

    function getChoice(data, labelKey = "name") {
        if (typeof labelKey === "function") {
            return { label: labelKey(data), value: data.id.toString() };
        }
        else {
            return { label: data[labelKey], value: data.id.toString() };
        }
    }
    function mapChoices(collection, labelKey = "name") {
        return collection.map((element) => getChoice(element, labelKey));
    }

    /* src\components\SelectCategories.svelte generated by Svelte v3.52.0 */

    const { console: console_1$2 } = globals;
    const file$h = "src\\components\\SelectCategories.svelte";

    function create_fragment$k(ctx) {
    	let div;
    	let label;
    	let t1;
    	let select;
    	let current;

    	select = new Select({
    			props: {
    				id: "category",
    				isDisabled: !/*programme*/ ctx[1],
    				isMulti: true,
    				items: /*choices*/ ctx[0],
    				loadOptions: /*func*/ ctx[4]
    			},
    			$$inline: true
    		});

    	select.$on("select", /*onSelect*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Choose your field(s) of interest";
    			t1 = space();
    			create_component(select.$$.fragment);
    			attr_dev(label, "for", "category");
    			add_location(label, file$h, 20, 4, 630);
    			attr_dev(div, "class", "field");
    			add_location(div, file$h, 19, 0, 605);
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
    			if (dirty & /*programme*/ 2) select_changes.isDisabled = !/*programme*/ ctx[1];
    			if (dirty & /*choices*/ 1) select_changes.items = /*choices*/ ctx[0];
    			if (dirty & /*programme*/ 2) select_changes.loadOptions = /*func*/ ctx[4];
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
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectCategories', slots, []);
    	let { programme } = $$props;
    	let { categories } = $$props;
    	let { choices = [] } = $$props;

    	async function updateChoices(programme) {
    		$$invalidate(0, choices = await getCategories("", programme).then(mapChoices));
    	}

    	function onSelect(ev) {
    		var _a;

    		$$invalidate(3, categories = (_a = ev === null || ev === void 0 ? void 0 : ev.detail) === null || _a === void 0
    		? void 0
    		: _a.map(c => c.value));

    		console.log({ ev, categories });
    	}

    	$$self.$$.on_mount.push(function () {
    		if (programme === undefined && !('programme' in $$props || $$self.$$.bound[$$self.$$.props['programme']])) {
    			console_1$2.warn("<SelectCategories> was created without expected prop 'programme'");
    		}

    		if (categories === undefined && !('categories' in $$props || $$self.$$.bound[$$self.$$.props['categories']])) {
    			console_1$2.warn("<SelectCategories> was created without expected prop 'categories'");
    		}
    	});

    	const writable_props = ['programme', 'categories', 'choices'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<SelectCategories> was created with unknown prop '${key}'`);
    	});

    	const func = q => getCategories(q, programme).then(mapChoices);

    	$$self.$$set = $$props => {
    		if ('programme' in $$props) $$invalidate(1, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(3, categories = $$props.categories);
    		if ('choices' in $$props) $$invalidate(0, choices = $$props.choices);
    	};

    	$$self.$capture_state = () => ({
    		Select,
    		getCategories,
    		mapChoices,
    		programme,
    		categories,
    		choices,
    		updateChoices,
    		onSelect
    	});

    	$$self.$inject_state = $$props => {
    		if ('programme' in $$props) $$invalidate(1, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(3, categories = $$props.categories);
    		if ('choices' in $$props) $$invalidate(0, choices = $$props.choices);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*programme*/ 2) {
    			{
    				updateChoices(programme);
    			}
    		}
    	};

    	return [choices, programme, onSelect, categories, func];
    }

    class SelectCategories extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { programme: 1, categories: 3, choices: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectCategories",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get programme() {
    		throw new Error("<SelectCategories>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set programme(value) {
    		throw new Error("<SelectCategories>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error("<SelectCategories>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<SelectCategories>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get choices() {
    		throw new Error("<SelectCategories>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set choices(value) {
    		throw new Error("<SelectCategories>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SelectClient.svelte generated by Svelte v3.52.0 */
    const file$g = "src\\components\\SelectClient.svelte";

    function create_fragment$j(ctx) {
    	let div;
    	let label;
    	let t1;
    	let select;
    	let current;

    	select = new Select({
    			props: {
    				id: "client",
    				items: /*choices*/ ctx[0],
    				loadOptions: /*func*/ ctx[7]
    			},
    			$$inline: true
    		});

    	select.$on("select", /*onSelect*/ ctx[5]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Do you have a host organization in mind?";
    			t1 = space();
    			create_component(select.$$.fragment);
    			attr_dev(label, "for", "client");
    			add_location(label, file$g, 22, 2, 720);
    			attr_dev(div, "class", "field");
    			add_location(div, file$g, 21, 0, 697);
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
    			if (dirty & /*choices*/ 1) select_changes.items = /*choices*/ ctx[0];
    			if (dirty & /*programme, categories, tutors, topics*/ 30) select_changes.loadOptions = /*func*/ ctx[7];
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
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectClient', slots, []);
    	let { programme } = $$props;
    	let { categories } = $$props;
    	let { tutors = [] } = $$props;
    	let { topics = [] } = $$props;
    	let { client } = $$props;
    	let { choices = [] } = $$props;

    	async function updateChoices(programme, categories, tutors, topics) {
    		$$invalidate(0, choices = await getClients("", programme, categories, topics, tutors).then(mapChoices));
    	}

    	function onSelect(ev) {
    		var _a;

    		$$invalidate(6, client = (_a = ev === null || ev === void 0 ? void 0 : ev.detail) === null || _a === void 0
    		? void 0
    		: _a.value);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (programme === undefined && !('programme' in $$props || $$self.$$.bound[$$self.$$.props['programme']])) {
    			console.warn("<SelectClient> was created without expected prop 'programme'");
    		}

    		if (categories === undefined && !('categories' in $$props || $$self.$$.bound[$$self.$$.props['categories']])) {
    			console.warn("<SelectClient> was created without expected prop 'categories'");
    		}

    		if (client === undefined && !('client' in $$props || $$self.$$.bound[$$self.$$.props['client']])) {
    			console.warn("<SelectClient> was created without expected prop 'client'");
    		}
    	});

    	const writable_props = ['programme', 'categories', 'tutors', 'topics', 'client', 'choices'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectClient> was created with unknown prop '${key}'`);
    	});

    	const func = q => getClients(q, programme, categories, tutors, topics);

    	$$self.$$set = $$props => {
    		if ('programme' in $$props) $$invalidate(1, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(2, categories = $$props.categories);
    		if ('tutors' in $$props) $$invalidate(3, tutors = $$props.tutors);
    		if ('topics' in $$props) $$invalidate(4, topics = $$props.topics);
    		if ('client' in $$props) $$invalidate(6, client = $$props.client);
    		if ('choices' in $$props) $$invalidate(0, choices = $$props.choices);
    	};

    	$$self.$capture_state = () => ({
    		Select,
    		getClients,
    		mapChoices,
    		programme,
    		categories,
    		tutors,
    		topics,
    		client,
    		choices,
    		updateChoices,
    		onSelect
    	});

    	$$self.$inject_state = $$props => {
    		if ('programme' in $$props) $$invalidate(1, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(2, categories = $$props.categories);
    		if ('tutors' in $$props) $$invalidate(3, tutors = $$props.tutors);
    		if ('topics' in $$props) $$invalidate(4, topics = $$props.topics);
    		if ('client' in $$props) $$invalidate(6, client = $$props.client);
    		if ('choices' in $$props) $$invalidate(0, choices = $$props.choices);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*programme, categories, tutors, topics*/ 30) {
    			{
    				updateChoices(programme, categories, tutors, topics);
    			}
    		}
    	};

    	return [choices, programme, categories, tutors, topics, onSelect, client, func];
    }

    class SelectClient extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			programme: 1,
    			categories: 2,
    			tutors: 3,
    			topics: 4,
    			client: 6,
    			choices: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectClient",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get programme() {
    		throw new Error("<SelectClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set programme(value) {
    		throw new Error("<SelectClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error("<SelectClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<SelectClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tutors() {
    		throw new Error("<SelectClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tutors(value) {
    		throw new Error("<SelectClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get topics() {
    		throw new Error("<SelectClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topics(value) {
    		throw new Error("<SelectClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get client() {
    		throw new Error("<SelectClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set client(value) {
    		throw new Error("<SelectClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get choices() {
    		throw new Error("<SelectClient>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set choices(value) {
    		throw new Error("<SelectClient>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SelectProgramme.svelte generated by Svelte v3.52.0 */
    const file$f = "src\\components\\SelectProgramme.svelte";

    function create_fragment$i(ctx) {
    	let div;
    	let label;
    	let t1;
    	let select;
    	let current;

    	select = new Select({
    			props: {
    				id: "programme",
    				items: /*choices*/ ctx[0],
    				loadOptions: getProgrammes
    			},
    			$$inline: true
    		});

    	select.$on("select", /*onSelect*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Choose your study programme";
    			t1 = space();
    			create_component(select.$$.fragment);
    			attr_dev(label, "for", "programme");
    			add_location(label, file$f, 16, 4, 519);
    			attr_dev(div, "class", "field");
    			add_location(div, file$f, 15, 0, 494);
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
    			if (dirty & /*choices*/ 1) select_changes.items = /*choices*/ ctx[0];
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
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectProgramme', slots, []);
    	let { choices = [] } = $$props;
    	let { programme } = $$props;

    	function onSelect(ev) {
    		var _a;

    		$$invalidate(2, programme = (_a = ev === null || ev === void 0 ? void 0 : ev.detail) === null || _a === void 0
    		? void 0
    		: _a.value);
    	}

    	onMount(async () => {
    		$$invalidate(0, choices = await getProgrammes("").then(mapChoices));
    	});

    	$$self.$$.on_mount.push(function () {
    		if (programme === undefined && !('programme' in $$props || $$self.$$.bound[$$self.$$.props['programme']])) {
    			console.warn("<SelectProgramme> was created without expected prop 'programme'");
    		}
    	});

    	const writable_props = ['choices', 'programme'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectProgramme> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('choices' in $$props) $$invalidate(0, choices = $$props.choices);
    		if ('programme' in $$props) $$invalidate(2, programme = $$props.programme);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Select,
    		getProgrammes,
    		mapChoices,
    		choices,
    		programme,
    		onSelect
    	});

    	$$self.$inject_state = $$props => {
    		if ('choices' in $$props) $$invalidate(0, choices = $$props.choices);
    		if ('programme' in $$props) $$invalidate(2, programme = $$props.programme);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [choices, onSelect, programme];
    }

    class SelectProgramme extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { choices: 0, programme: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectProgramme",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get choices() {
    		throw new Error("<SelectProgramme>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set choices(value) {
    		throw new Error("<SelectProgramme>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get programme() {
    		throw new Error("<SelectProgramme>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set programme(value) {
    		throw new Error("<SelectProgramme>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SelectSupervisor.svelte generated by Svelte v3.52.0 */
    const file$e = "src\\components\\SelectSupervisor.svelte";

    function create_fragment$h(ctx) {
    	let div;
    	let label;
    	let t1;
    	let select;
    	let updating_value;
    	let current;

    	function select_value_binding(value) {
    		/*select_value_binding*/ ctx[7](value);
    	}

    	let select_props = {
    		id: "tutors",
    		isMulti: true,
    		items: /*choices*/ ctx[1],
    		loadOptions: /*func*/ ctx[6]
    	};

    	if (/*tutors*/ ctx[0] !== void 0) {
    		select_props.value = /*tutors*/ ctx[0];
    	}

    	select = new Select({ props: select_props, $$inline: true });
    	binding_callbacks.push(() => bind(select, 'value', select_value_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Do you have supervisors in mind?";
    			t1 = space();
    			create_component(select.$$.fragment);
    			attr_dev(label, "for", "tutors");
    			add_location(label, file$e, 18, 2, 610);
    			attr_dev(div, "class", "field");
    			add_location(div, file$e, 17, 0, 587);
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
    			if (dirty & /*choices*/ 2) select_changes.items = /*choices*/ ctx[1];
    			if (dirty & /*programme, categories, topics, client*/ 60) select_changes.loadOptions = /*func*/ ctx[6];

    			if (!updating_value && dirty & /*tutors*/ 1) {
    				updating_value = true;
    				select_changes.value = /*tutors*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
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
    			if (detaching) detach_dev(div);
    			destroy_component(select);
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
    	validate_slots('SelectSupervisor', slots, []);
    	let { programme } = $$props;
    	let { categories } = $$props;
    	let { client = undefined } = $$props;
    	let { topics = [] } = $$props;
    	let { tutors = [] } = $$props;
    	let { choices = [] } = $$props;

    	async function updateChoices(programme, categories, client, topics) {
    		$$invalidate(1, choices = await getTutors().then(tutors => mapChoices(tutors, el => el.names[0])));
    	}

    	$$self.$$.on_mount.push(function () {
    		if (programme === undefined && !('programme' in $$props || $$self.$$.bound[$$self.$$.props['programme']])) {
    			console.warn("<SelectSupervisor> was created without expected prop 'programme'");
    		}

    		if (categories === undefined && !('categories' in $$props || $$self.$$.bound[$$self.$$.props['categories']])) {
    			console.warn("<SelectSupervisor> was created without expected prop 'categories'");
    		}
    	});

    	const writable_props = ['programme', 'categories', 'client', 'topics', 'tutors', 'choices'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SelectSupervisor> was created with unknown prop '${key}'`);
    	});

    	const func = q => getTutors();

    	function select_value_binding(value) {
    		tutors = value;
    		$$invalidate(0, tutors);
    	}

    	$$self.$$set = $$props => {
    		if ('programme' in $$props) $$invalidate(2, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(3, categories = $$props.categories);
    		if ('client' in $$props) $$invalidate(4, client = $$props.client);
    		if ('topics' in $$props) $$invalidate(5, topics = $$props.topics);
    		if ('tutors' in $$props) $$invalidate(0, tutors = $$props.tutors);
    		if ('choices' in $$props) $$invalidate(1, choices = $$props.choices);
    	};

    	$$self.$capture_state = () => ({
    		Select,
    		getTutors,
    		mapChoices,
    		programme,
    		categories,
    		client,
    		topics,
    		tutors,
    		choices,
    		updateChoices
    	});

    	$$self.$inject_state = $$props => {
    		if ('programme' in $$props) $$invalidate(2, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(3, categories = $$props.categories);
    		if ('client' in $$props) $$invalidate(4, client = $$props.client);
    		if ('topics' in $$props) $$invalidate(5, topics = $$props.topics);
    		if ('tutors' in $$props) $$invalidate(0, tutors = $$props.tutors);
    		if ('choices' in $$props) $$invalidate(1, choices = $$props.choices);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*programme, categories, client, topics*/ 60) {
    			{
    				updateChoices();
    			}
    		}
    	};

    	return [
    		tutors,
    		choices,
    		programme,
    		categories,
    		client,
    		topics,
    		func,
    		select_value_binding
    	];
    }

    class SelectSupervisor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			programme: 2,
    			categories: 3,
    			client: 4,
    			topics: 5,
    			tutors: 0,
    			choices: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectSupervisor",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get programme() {
    		throw new Error("<SelectSupervisor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set programme(value) {
    		throw new Error("<SelectSupervisor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error("<SelectSupervisor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<SelectSupervisor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get client() {
    		throw new Error("<SelectSupervisor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set client(value) {
    		throw new Error("<SelectSupervisor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get topics() {
    		throw new Error("<SelectSupervisor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topics(value) {
    		throw new Error("<SelectSupervisor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tutors() {
    		throw new Error("<SelectSupervisor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tutors(value) {
    		throw new Error("<SelectSupervisor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get choices() {
    		throw new Error("<SelectSupervisor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set choices(value) {
    		throw new Error("<SelectSupervisor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SelectTopic.svelte generated by Svelte v3.52.0 */

    const { console: console_1$1 } = globals;
    const file$d = "src\\components\\SelectTopic.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let label;
    	let t1;
    	let select;
    	let current;

    	select = new Select({
    			props: {
    				id: "topics",
    				items: /*choices*/ ctx[0],
    				isMulti: true,
    				loadOptions: /*func*/ ctx[7]
    			},
    			$$inline: true
    		});

    	select.$on("select", /*onSelect*/ ctx[5]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			label.textContent = "Do you have any topic(s) in mind?";
    			t1 = space();
    			create_component(select.$$.fragment);
    			attr_dev(label, "for", "topics");
    			add_location(label, file$d, 25, 4, 796);
    			attr_dev(div, "class", "field");
    			add_location(div, file$d, 24, 0, 771);
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
    			if (dirty & /*choices*/ 1) select_changes.items = /*choices*/ ctx[0];
    			if (dirty & /*programme, categories, tutors, client*/ 30) select_changes.loadOptions = /*func*/ ctx[7];
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
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SelectTopic', slots, []);
    	let { programme } = $$props;
    	let { categories } = $$props;
    	let { tutors = [] } = $$props;
    	let { client = undefined } = $$props;
    	let { topics = undefined } = $$props;
    	let { choices = [] } = $$props;

    	async function updateChoices(programme, categories, tutors, client) {
    		$$invalidate(0, choices = await getTopics("", programme, categories, tutors, client).then(mapChoices));
    	}

    	function onSelect(ev) {
    		var _a;

    		$$invalidate(6, topics = (_a = ev === null || ev === void 0 ? void 0 : ev.detail) === null || _a === void 0
    		? void 0
    		: _a.map(c => c.value));
    	}

    	$$self.$$.on_mount.push(function () {
    		if (programme === undefined && !('programme' in $$props || $$self.$$.bound[$$self.$$.props['programme']])) {
    			console_1$1.warn("<SelectTopic> was created without expected prop 'programme'");
    		}

    		if (categories === undefined && !('categories' in $$props || $$self.$$.bound[$$self.$$.props['categories']])) {
    			console_1$1.warn("<SelectTopic> was created without expected prop 'categories'");
    		}
    	});

    	const writable_props = ['programme', 'categories', 'tutors', 'client', 'topics', 'choices'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<SelectTopic> was created with unknown prop '${key}'`);
    	});

    	const func = q => getTopics(q, programme, categories, tutors, client);

    	$$self.$$set = $$props => {
    		if ('programme' in $$props) $$invalidate(1, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(2, categories = $$props.categories);
    		if ('tutors' in $$props) $$invalidate(3, tutors = $$props.tutors);
    		if ('client' in $$props) $$invalidate(4, client = $$props.client);
    		if ('topics' in $$props) $$invalidate(6, topics = $$props.topics);
    		if ('choices' in $$props) $$invalidate(0, choices = $$props.choices);
    	};

    	$$self.$capture_state = () => ({
    		Select,
    		getTopics,
    		mapChoices,
    		programme,
    		categories,
    		tutors,
    		client,
    		topics,
    		choices,
    		updateChoices,
    		onSelect
    	});

    	$$self.$inject_state = $$props => {
    		if ('programme' in $$props) $$invalidate(1, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(2, categories = $$props.categories);
    		if ('tutors' in $$props) $$invalidate(3, tutors = $$props.tutors);
    		if ('client' in $$props) $$invalidate(4, client = $$props.client);
    		if ('topics' in $$props) $$invalidate(6, topics = $$props.topics);
    		if ('choices' in $$props) $$invalidate(0, choices = $$props.choices);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*programme, categories, tutors, client*/ 30) {
    			{
    				updateChoices(programme, categories, tutors, client);
    			}
    		}

    		if ($$self.$$.dirty & /*categories*/ 4) {
    			{
    				console.log({ categories });
    			}
    		}
    	};

    	return [choices, programme, categories, tutors, client, onSelect, topics, func];
    }

    class SelectTopic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			programme: 1,
    			categories: 2,
    			tutors: 3,
    			client: 4,
    			topics: 6,
    			choices: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectTopic",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get programme() {
    		throw new Error("<SelectTopic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set programme(value) {
    		throw new Error("<SelectTopic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error("<SelectTopic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<SelectTopic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tutors() {
    		throw new Error("<SelectTopic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tutors(value) {
    		throw new Error("<SelectTopic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get client() {
    		throw new Error("<SelectTopic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set client(value) {
    		throw new Error("<SelectTopic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get topics() {
    		throw new Error("<SelectTopic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topics(value) {
    		throw new Error("<SelectTopic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get choices() {
    		throw new Error("<SelectTopic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set choices(value) {
    		throw new Error("<SelectTopic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Supervisor.svelte generated by Svelte v3.52.0 */

    const { console: console_1 } = globals;
    const file$c = "src\\components\\Supervisor.svelte";

    // (16:4) {#if details}
    function create_if_block$a(ctx) {
    	let div9;
    	let div0;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div8;
    	let div1;
    	let t1_value = /*details*/ ctx[0].name + "";
    	let t1;
    	let t2;
    	let t3_value = /*details*/ ctx[0].givenName + "";
    	let t3;
    	let t4;
    	let t5;
    	let div2;
    	let t6_value = /*details*/ ctx[0].jobtitle + "";
    	let t6;
    	let t7;
    	let div7;
    	let div3;
    	let t8_value = /*details*/ ctx[0].mail + "";
    	let t8;
    	let t9;
    	let div4;
    	let t10_value = /*details*/ ctx[0].phoneWork + "";
    	let t10;
    	let t11;
    	let div5;
    	let a;
    	let t12_value = /*details*/ ctx[0].profileUrl + "";
    	let t12;
    	let a_href_value;
    	let t13;
    	let div6;
    	let t14_value = /*details*/ ctx[0].locations.map(func$1).join(", ") + "";
    	let t14;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div8 = element("div");
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = text(" (");
    			t3 = text(t3_value);
    			t4 = text(")");
    			t5 = space();
    			div2 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			div7 = element("div");
    			div3 = element("div");
    			t8 = text(t8_value);
    			t9 = space();
    			div4 = element("div");
    			t10 = text(t10_value);
    			t11 = space();
    			div5 = element("div");
    			a = element("a");
    			t12 = text(t12_value);
    			t13 = space();
    			div6 = element("div");
    			t14 = text(t14_value);
    			if (!src_url_equal(img.src, img_src_value = /*details*/ ctx[0].pictureUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*details*/ ctx[0].name);
    			add_location(img, file$c, 17, 31, 610);
    			attr_dev(div0, "class", "photo");
    			add_location(div0, file$c, 17, 12, 591);
    			attr_dev(div1, "class", "name");
    			add_location(div1, file$c, 19, 16, 719);
    			attr_dev(div2, "class", "jobtitle");
    			add_location(div2, file$c, 20, 16, 797);
    			attr_dev(div3, "class", "mail");
    			add_location(div3, file$c, 22, 20, 904);
    			attr_dev(div4, "class", "phone");
    			add_location(div4, file$c, 23, 20, 964);
    			attr_dev(a, "href", a_href_value = /*details*/ ctx[0].profileUrl);
    			add_location(a, file$c, 24, 41, 1051);
    			attr_dev(div5, "class", "profile");
    			add_location(div5, file$c, 24, 20, 1030);
    			attr_dev(div6, "class", "office");
    			add_location(div6, file$c, 25, 20, 1132);
    			attr_dev(div7, "class", "contact");
    			add_location(div7, file$c, 21, 16, 861);
    			attr_dev(div8, "class", "content");
    			add_location(div8, file$c, 18, 12, 680);
    			attr_dev(div9, "class", "cards");
    			add_location(div9, file$c, 16, 8, 558);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div0);
    			append_dev(div0, img);
    			append_dev(div9, t0);
    			append_dev(div9, div8);
    			append_dev(div8, div1);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div8, t5);
    			append_dev(div8, div2);
    			append_dev(div2, t6);
    			append_dev(div8, t7);
    			append_dev(div8, div7);
    			append_dev(div7, div3);
    			append_dev(div3, t8);
    			append_dev(div7, t9);
    			append_dev(div7, div4);
    			append_dev(div4, t10);
    			append_dev(div7, t11);
    			append_dev(div7, div5);
    			append_dev(div5, a);
    			append_dev(a, t12);
    			append_dev(div7, t13);
    			append_dev(div7, div6);
    			append_dev(div6, t14);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*details*/ 1 && !src_url_equal(img.src, img_src_value = /*details*/ ctx[0].pictureUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*details*/ 1 && img_alt_value !== (img_alt_value = /*details*/ ctx[0].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*details*/ 1 && t1_value !== (t1_value = /*details*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*details*/ 1 && t3_value !== (t3_value = /*details*/ ctx[0].givenName + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*details*/ 1 && t6_value !== (t6_value = /*details*/ ctx[0].jobtitle + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*details*/ 1 && t8_value !== (t8_value = /*details*/ ctx[0].mail + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*details*/ 1 && t10_value !== (t10_value = /*details*/ ctx[0].phoneWork + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*details*/ 1 && t12_value !== (t12_value = /*details*/ ctx[0].profileUrl + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*details*/ 1 && a_href_value !== (a_href_value = /*details*/ ctx[0].profileUrl)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*details*/ 1 && t14_value !== (t14_value = /*details*/ ctx[0].locations.map(func$1).join(", ") + "")) set_data_dev(t14, t14_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(16:4) {#if details}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let if_block = /*details*/ ctx[0] && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "person");
    			add_location(div, file$c, 14, 0, 509);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*details*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$a(ctx);
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

    const func$1 = l => l.location;

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Supervisor', slots, []);
    	let { label } = $$props;
    	let details;

    	async function update_people_details(label) {
    		let response = await fetch(`https://people.utwente.nl/peoplepagesopenapi/contacts?query=${encodeURIComponent(label)}`);
    		let data = await response.json();
    		console.log({ data });

    		if ((data === null || data === void 0 ? void 0 : data.data) && data.data.length >= 1) {
    			console.log(data.data[0]);
    			$$invalidate(0, details = data.data[0]);
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (label === undefined && !('label' in $$props || $$self.$$.bound[$$self.$$.props['label']])) {
    			console_1.warn("<Supervisor> was created without expected prop 'label'");
    		}
    	});

    	const writable_props = ['label'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Supervisor> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    	};

    	$$self.$capture_state = () => ({ label, details, update_people_details });

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('details' in $$props) $$invalidate(0, details = $$props.details);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*label*/ 2) {
    			update_people_details(label);
    		}
    	};

    	return [details, label];
    }

    class Supervisor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { label: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Supervisor",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get label() {
    		throw new Error("<Supervisor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Supervisor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ExploreSupervisors.svelte generated by Svelte v3.52.0 */
    const file$b = "src\\components\\ExploreSupervisors.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (11:4) {#each supervisors as supervisor}
    function create_each_block$4(ctx) {
    	let supervisor;
    	let current;

    	supervisor = new Supervisor({
    			props: { label: /*supervisor*/ ctx[5].name },
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
    		p: noop,
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
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(11:4) {#each supervisors as supervisor}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let current;
    	let each_value = /*supervisors*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
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

    			attr_dev(div, "class", "explore-supervisors");
    			add_location(div, file$b, 9, 0, 333);
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
    			if (dirty & /*supervisors*/ 1) {
    				each_value = /*supervisors*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
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
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExploreSupervisors', slots, []);
    	let { programme } = $$props;
    	let { categories } = $$props;
    	let { client } = $$props;
    	let { topics } = $$props;

    	// todo: query supervisors from API
    	let supervisors = [
    		{
    			id: 123,
    			name: "Karel Kroeze",
    			department: "BDSi"
    		},
    		{
    			id: 321,
    			name: "Anna Machens",
    			department: "BDSi"
    		}
    	];

    	$$self.$$.on_mount.push(function () {
    		if (programme === undefined && !('programme' in $$props || $$self.$$.bound[$$self.$$.props['programme']])) {
    			console.warn("<ExploreSupervisors> was created without expected prop 'programme'");
    		}

    		if (categories === undefined && !('categories' in $$props || $$self.$$.bound[$$self.$$.props['categories']])) {
    			console.warn("<ExploreSupervisors> was created without expected prop 'categories'");
    		}

    		if (client === undefined && !('client' in $$props || $$self.$$.bound[$$self.$$.props['client']])) {
    			console.warn("<ExploreSupervisors> was created without expected prop 'client'");
    		}

    		if (topics === undefined && !('topics' in $$props || $$self.$$.bound[$$self.$$.props['topics']])) {
    			console.warn("<ExploreSupervisors> was created without expected prop 'topics'");
    		}
    	});

    	const writable_props = ['programme', 'categories', 'client', 'topics'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExploreSupervisors> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('programme' in $$props) $$invalidate(1, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(2, categories = $$props.categories);
    		if ('client' in $$props) $$invalidate(3, client = $$props.client);
    		if ('topics' in $$props) $$invalidate(4, topics = $$props.topics);
    	};

    	$$self.$capture_state = () => ({
    		Supervisor,
    		programme,
    		categories,
    		client,
    		topics,
    		supervisors
    	});

    	$$self.$inject_state = $$props => {
    		if ('programme' in $$props) $$invalidate(1, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(2, categories = $$props.categories);
    		if ('client' in $$props) $$invalidate(3, client = $$props.client);
    		if ('topics' in $$props) $$invalidate(4, topics = $$props.topics);
    		if ('supervisors' in $$props) $$invalidate(0, supervisors = $$props.supervisors);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [supervisors, programme, categories, client, topics];
    }

    class ExploreSupervisors extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			programme: 1,
    			categories: 2,
    			client: 3,
    			topics: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExploreSupervisors",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get programme() {
    		throw new Error("<ExploreSupervisors>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set programme(value) {
    		throw new Error("<ExploreSupervisors>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error("<ExploreSupervisors>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<ExploreSupervisors>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get client() {
    		throw new Error("<ExploreSupervisors>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set client(value) {
    		throw new Error("<ExploreSupervisors>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get topics() {
    		throw new Error("<ExploreSupervisors>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topics(value) {
    		throw new Error("<ExploreSupervisors>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Topic.svelte generated by Svelte v3.52.0 */

    const file$a = "src\\components\\Topic.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let t_value = /*topic*/ ctx[0].name + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "topic svelte-1kfws0u");
    			add_location(div, file$a, 10, 0, 163);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*topic*/ 1 && t_value !== (t_value = /*topic*/ ctx[0].name + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Topic', slots, []);
    	let { topic } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (topic === undefined && !('topic' in $$props || $$self.$$.bound[$$self.$$.props['topic']])) {
    			console.warn("<Topic> was created without expected prop 'topic'");
    		}
    	});

    	const writable_props = ['topic'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Topic> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    	};

    	$$self.$capture_state = () => ({ topic });

    	$$self.$inject_state = $$props => {
    		if ('topic' in $$props) $$invalidate(0, topic = $$props.topic);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [topic];
    }

    class Topic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { topic: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Topic",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get topic() {
    		throw new Error("<Topic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topic(value) {
    		throw new Error("<Topic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ExploreTopics.svelte generated by Svelte v3.52.0 */
    const file$9 = "src\\components\\ExploreTopics.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (31:4) {#each topics as topic}
    function create_each_block$3(ctx) {
    	let topic;
    	let current;

    	topic = new Topic({
    			props: { topic: /*topic*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(topic.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(topic, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const topic_changes = {};
    			if (dirty & /*topics*/ 1) topic_changes.topic = /*topic*/ ctx[6];
    			topic.$set(topic_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(topic.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(topic.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(topic, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(31:4) {#each topics as topic}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let current;
    	let each_value = /*topics*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
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

    			attr_dev(div, "class", "explore-topics svelte-nnwvky");
    			add_location(div, file$9, 29, 0, 730);
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
    			if (dirty & /*topics*/ 1) {
    				each_value = /*topics*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
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
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExploreTopics', slots, []);
    	let { programme } = $$props;
    	let { categories } = $$props;
    	let { client } = $$props;
    	let { supervisors } = $$props;

    	// todo: query supervisors from API
    	let topics = [];

    	async function updateTopics(programme, categories, client, supervisors) {
    		$$invalidate(0, topics = await getTopics("", programme, categories, supervisors, client));
    	}

    	$$self.$$.on_mount.push(function () {
    		if (programme === undefined && !('programme' in $$props || $$self.$$.bound[$$self.$$.props['programme']])) {
    			console.warn("<ExploreTopics> was created without expected prop 'programme'");
    		}

    		if (categories === undefined && !('categories' in $$props || $$self.$$.bound[$$self.$$.props['categories']])) {
    			console.warn("<ExploreTopics> was created without expected prop 'categories'");
    		}

    		if (client === undefined && !('client' in $$props || $$self.$$.bound[$$self.$$.props['client']])) {
    			console.warn("<ExploreTopics> was created without expected prop 'client'");
    		}

    		if (supervisors === undefined && !('supervisors' in $$props || $$self.$$.bound[$$self.$$.props['supervisors']])) {
    			console.warn("<ExploreTopics> was created without expected prop 'supervisors'");
    		}
    	});

    	const writable_props = ['programme', 'categories', 'client', 'supervisors'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExploreTopics> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('programme' in $$props) $$invalidate(1, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(2, categories = $$props.categories);
    		if ('client' in $$props) $$invalidate(3, client = $$props.client);
    		if ('supervisors' in $$props) $$invalidate(4, supervisors = $$props.supervisors);
    	};

    	$$self.$capture_state = () => ({
    		getTopics,
    		Topic,
    		programme,
    		categories,
    		client,
    		supervisors,
    		topics,
    		updateTopics
    	});

    	$$self.$inject_state = $$props => {
    		if ('programme' in $$props) $$invalidate(1, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(2, categories = $$props.categories);
    		if ('client' in $$props) $$invalidate(3, client = $$props.client);
    		if ('supervisors' in $$props) $$invalidate(4, supervisors = $$props.supervisors);
    		if ('topics' in $$props) $$invalidate(0, topics = $$props.topics);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*programme, categories, client, supervisors*/ 30) {
    			{
    				updateTopics(programme, categories, client, supervisors);
    			}
    		}
    	};

    	return [topics, programme, categories, client, supervisors];
    }

    class ExploreTopics extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			programme: 1,
    			categories: 2,
    			client: 3,
    			supervisors: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExploreTopics",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get programme() {
    		throw new Error("<ExploreTopics>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set programme(value) {
    		throw new Error("<ExploreTopics>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error("<ExploreTopics>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<ExploreTopics>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get client() {
    		throw new Error("<ExploreTopics>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set client(value) {
    		throw new Error("<ExploreTopics>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get supervisors() {
    		throw new Error("<ExploreTopics>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set supervisors(value) {
    		throw new Error("<ExploreTopics>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ..\node_modules\.pnpm\svelte-simple-datatables@0.2.3\node_modules\svelte-simple-datatables\src\components\SearchInputHTML.svelte generated by Svelte v3.52.0 */

    const file$8 = "..\\node_modules\\.pnpm\\svelte-simple-datatables@0.2.3\\node_modules\\svelte-simple-datatables\\src\\components\\SearchInputHTML.svelte";

    function create_fragment$b(ctx) {
    	let input;
    	let input_class_value;
    	let input_placeholder_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", input_class_value = "" + (null_to_empty(/*classList*/ ctx[1]) + " svelte-1mpljnc"));
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", input_placeholder_value = /*$options*/ ctx[2].labels.search);
    			attr_dev(input, "ref", /*ref*/ ctx[0]);
    			toggle_class(input, "css", /*$options*/ ctx[2].css);
    			add_location(input, file$8, 13, 0, 279);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_handler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*classList*/ 2 && input_class_value !== (input_class_value = "" + (null_to_empty(/*classList*/ ctx[1]) + " svelte-1mpljnc"))) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty & /*$options*/ 4 && input_placeholder_value !== (input_placeholder_value = /*$options*/ ctx[2].labels.search)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}

    			if (dirty & /*ref*/ 1) {
    				attr_dev(input, "ref", /*ref*/ ctx[0]);
    			}

    			if (dirty & /*classList, $options*/ 6) {
    				toggle_class(input, "css", /*$options*/ ctx[2].css);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
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

    function instance$b($$self, $$props, $$invalidate) {
    	let $options;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchInputHTML', slots, []);
    	let { context } = $$props;
    	let { ref = '' } = $$props;
    	let { classList = '' } = $$props;
    	const options = context.getOptions();
    	validate_store(options, 'options');
    	component_subscribe($$self, options, value => $$invalidate(2, $options = value));

    	const search = value => {
    		context.getPageNumber().set(1);
    		context.getGlobalFilter().set(value);
    		context.getColumns().redraw();
    	};

    	$$self.$$.on_mount.push(function () {
    		if (context === undefined && !('context' in $$props || $$self.$$.bound[$$self.$$.props['context']])) {
    			console.warn("<SearchInputHTML> was created without expected prop 'context'");
    		}
    	});

    	const writable_props = ['context', 'ref', 'classList'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchInputHTML> was created with unknown prop '${key}'`);
    	});

    	const input_handler = e => search(e.target.value);

    	$$self.$$set = $$props => {
    		if ('context' in $$props) $$invalidate(5, context = $$props.context);
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    	};

    	$$self.$capture_state = () => ({
    		context,
    		ref,
    		classList,
    		options,
    		search,
    		$options
    	});

    	$$self.$inject_state = $$props => {
    		if ('context' in $$props) $$invalidate(5, context = $$props.context);
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, classList, $options, options, search, context, input_handler];
    }

    class SearchInputHTML extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { context: 5, ref: 0, classList: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchInputHTML",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get context() {
    		throw new Error("<SearchInputHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set context(value) {
    		throw new Error("<SearchInputHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<SearchInputHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<SearchInputHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<SearchInputHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<SearchInputHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

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

    const createContext = () => {
        const { subscribe, set, update } = writable({});
        return {
            subscribe, set, update,
            index: () => {
                let $context;
                context.subscribe(store => $context = store);
                return $context
            },
            add: (stores) => {
                const id = stores.getId().get();
                const newContext = { [id]: stores  };
                context.set({ ...context.index(),  ...newContext });
                return newContext[id]
            },
            get: (id) => {
                return context.index()[id] 
            }
        }
    };

    const context = createContext();

    /* ..\node_modules\.pnpm\svelte-simple-datatables@0.2.3\node_modules\svelte-simple-datatables\src\SearchInput.svelte generated by Svelte v3.52.0 */

    // (23:0) {#if context}
    function create_if_block$9(ctx) {
    	let searchinputhtml;
    	let current;

    	searchinputhtml = new SearchInputHTML({
    			props: {
    				context: /*context*/ ctx[2],
    				ref: /*ref*/ ctx[0],
    				classList: /*classList*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(searchinputhtml.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchinputhtml, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const searchinputhtml_changes = {};
    			if (dirty & /*context*/ 4) searchinputhtml_changes.context = /*context*/ ctx[2];
    			if (dirty & /*ref*/ 1) searchinputhtml_changes.ref = /*ref*/ ctx[0];
    			if (dirty & /*classList*/ 2) searchinputhtml_changes.classList = /*classList*/ ctx[1];
    			searchinputhtml.$set(searchinputhtml_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchinputhtml.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchinputhtml.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchinputhtml, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(23:0) {#if context}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*context*/ ctx[2] && create_if_block$9(ctx);

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
    			if (/*context*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*context*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$9(ctx);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchInput', slots, []);
    	let { ref = '' } = $$props;
    	let { classList = '' } = $$props;
    	let { id = 'svelte-simple-datatable' } = $$props;
    	let context$1 = null;
    	let loop = 0;

    	const interval = setInterval(
    		() => {
    			loop++;

    			if (context.get(id)) {
    				$$invalidate(2, context$1 = context.get(id));
    				clearInterval(interval);
    			} else if (loop === 20) {
    				clearInterval(interval);
    			}
    		},
    		50
    	);

    	const writable_props = ['ref', 'classList', 'id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchInput> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		SearchInputHTML,
    		store: context,
    		ref,
    		classList,
    		id,
    		context: context$1,
    		loop,
    		interval
    	});

    	$$self.$inject_state = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    		if ('context' in $$props) $$invalidate(2, context$1 = $$props.context);
    		if ('loop' in $$props) loop = $$props.loop;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, classList, context$1, id];
    }

    class SearchInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { ref: 0, classList: 1, id: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchInput",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get ref() {
    		throw new Error("<SearchInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<SearchInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<SearchInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<SearchInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<SearchInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<SearchInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ..\node_modules\.pnpm\svelte-simple-datatables@0.2.3\node_modules\svelte-simple-datatables\src\components\Search.svelte generated by Svelte v3.52.0 */
    const file$7 = "..\\node_modules\\.pnpm\\svelte-simple-datatables@0.2.3\\node_modules\\svelte-simple-datatables\\src\\components\\Search.svelte";

    function create_fragment$9(ctx) {
    	let section;
    	let searchinput;
    	let current;

    	searchinput = new SearchInput({
    			props: { id: /*id*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(searchinput.$$.fragment);
    			attr_dev(section, "class", "dt-search svelte-16n96wa");
    			toggle_class(section, "css", /*$options*/ ctx[2].css);
    			add_location(section, file$7, 7, 0, 112);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(searchinput, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const searchinput_changes = {};
    			if (dirty & /*id*/ 1) searchinput_changes.id = /*id*/ ctx[0];
    			searchinput.$set(searchinput_changes);

    			if (!current || dirty & /*$options*/ 4) {
    				toggle_class(section, "css", /*$options*/ ctx[2].css);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(searchinput);
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
    	let $options,
    		$$unsubscribe_options = noop,
    		$$subscribe_options = () => ($$unsubscribe_options(), $$unsubscribe_options = subscribe(options, $$value => $$invalidate(2, $options = $$value)), options);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_options());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Search', slots, []);
    	let { id } = $$props;
    	let { options } = $$props;
    	validate_store(options, 'options');
    	$$subscribe_options();

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<Search> was created without expected prop 'id'");
    		}

    		if (options === undefined && !('options' in $$props || $$self.$$.bound[$$self.$$.props['options']])) {
    			console.warn("<Search> was created without expected prop 'options'");
    		}
    	});

    	const writable_props = ['id', 'options'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Search> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('options' in $$props) $$subscribe_options($$invalidate(1, options = $$props.options));
    	};

    	$$self.$capture_state = () => ({ SearchInput, id, options, $options });

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('options' in $$props) $$subscribe_options($$invalidate(1, options = $$props.options));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, options, $options];
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { id: 0, options: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get id() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Search>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Search>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ..\node_modules\.pnpm\svelte-simple-datatables@0.2.3\node_modules\svelte-simple-datatables\src\components\PaginationRowCountHTML.svelte generated by Svelte v3.52.0 */

    const file$6 = "..\\node_modules\\.pnpm\\svelte-simple-datatables@0.2.3\\node_modules\\svelte-simple-datatables\\src\\components\\PaginationRowCountHTML.svelte";

    // (28:1) {:else}
    function create_else_block_1(ctx) {
    	let html_tag;
    	let raw_value = `<b>${/*start*/ ctx[4]}</b>-<b>${/*end*/ ctx[3]}</b>/<b>${/*rows*/ ctx[2]}</b>` + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*start, end, rows*/ 28 && raw_value !== (raw_value = `<b>${/*start*/ ctx[4]}</b>-<b>${/*end*/ ctx[3]}</b>/<b>${/*rows*/ ctx[2]}</b>` + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(28:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:1) {#if $datatableWidth > 600}
    function create_if_block$8(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*rows*/ ctx[2] > 0) return create_if_block_1$5;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(22:1) {#if $datatableWidth > 600}",
    		ctx
    	});

    	return block;
    }

    // (25:2) {:else}
    function create_else_block$2(ctx) {
    	let html_tag;
    	let raw_value = /*$options*/ ctx[5].labels.noRows + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$options*/ 32 && raw_value !== (raw_value = /*$options*/ ctx[5].labels.noRows + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(25:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if rows > 0}
    function create_if_block_1$5(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*info*/ ctx[6], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 64) html_tag.p(/*info*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(23:2) {#if rows > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let aside;
    	let aside_class_value;

    	function select_block_type(ctx, dirty) {
    		if (/*$datatableWidth*/ ctx[7] > 600) return create_if_block$8;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			if_block.c();
    			attr_dev(aside, "class", aside_class_value = "dt-pagination-rowcount " + /*classList*/ ctx[1] + " svelte-bzwyk1");
    			attr_dev(aside, "ref", /*ref*/ ctx[0]);
    			toggle_class(aside, "css", /*$options*/ ctx[5].css);
    			add_location(aside, file$6, 20, 0, 602);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			if_block.m(aside, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(aside, null);
    				}
    			}

    			if (dirty & /*classList*/ 2 && aside_class_value !== (aside_class_value = "dt-pagination-rowcount " + /*classList*/ ctx[1] + " svelte-bzwyk1")) {
    				attr_dev(aside, "class", aside_class_value);
    			}

    			if (dirty & /*ref*/ 1) {
    				attr_dev(aside, "ref", /*ref*/ ctx[0]);
    			}

    			if (dirty & /*classList, $options*/ 34) {
    				toggle_class(aside, "css", /*$options*/ ctx[5].css);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			if_block.d();
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
    	let start;
    	let end;
    	let rows;
    	let info;
    	let $options;
    	let $rowsCount;
    	let $pageNumber;
    	let $datatableWidth;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaginationRowCountHTML', slots, []);
    	let { context } = $$props;
    	let { ref = '' } = $$props;
    	let { classList = '' } = $$props;
    	const rowsCount = context.getRowsCount();
    	validate_store(rowsCount, 'rowsCount');
    	component_subscribe($$self, rowsCount, value => $$invalidate(13, $rowsCount = value));
    	const options = context.getOptions();
    	validate_store(options, 'options');
    	component_subscribe($$self, options, value => $$invalidate(5, $options = value));
    	const pageNumber = context.getPageNumber();
    	validate_store(pageNumber, 'pageNumber');
    	component_subscribe($$self, pageNumber, value => $$invalidate(14, $pageNumber = value));
    	const datatableWidth = context.getDatatableWidth();
    	validate_store(datatableWidth, 'datatableWidth');
    	component_subscribe($$self, datatableWidth, value => $$invalidate(7, $datatableWidth = value));

    	$$self.$$.on_mount.push(function () {
    		if (context === undefined && !('context' in $$props || $$self.$$.bound[$$self.$$.props['context']])) {
    			console.warn("<PaginationRowCountHTML> was created without expected prop 'context'");
    		}
    	});

    	const writable_props = ['context', 'ref', 'classList'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PaginationRowCountHTML> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('context' in $$props) $$invalidate(12, context = $$props.context);
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    	};

    	$$self.$capture_state = () => ({
    		context,
    		ref,
    		classList,
    		rowsCount,
    		options,
    		pageNumber,
    		datatableWidth,
    		rows,
    		end,
    		start,
    		info,
    		$options,
    		$rowsCount,
    		$pageNumber,
    		$datatableWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('context' in $$props) $$invalidate(12, context = $$props.context);
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('rows' in $$props) $$invalidate(2, rows = $$props.rows);
    		if ('end' in $$props) $$invalidate(3, end = $$props.end);
    		if ('start' in $$props) $$invalidate(4, start = $$props.start);
    		if ('info' in $$props) $$invalidate(6, info = $$props.info);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$pageNumber, $options*/ 16416) {
    			$$invalidate(4, start = $pageNumber * $options.rowsPerPage - $options.rowsPerPage + 1);
    		}

    		if ($$self.$$.dirty & /*$pageNumber, $options, $rowsCount*/ 24608) {
    			$$invalidate(3, end = Math.min($pageNumber * $options.rowsPerPage, $rowsCount));
    		}

    		if ($$self.$$.dirty & /*$rowsCount*/ 8192) {
    			$$invalidate(2, rows = $rowsCount);
    		}

    		if ($$self.$$.dirty & /*$options, start, end, rows*/ 60) {
    			$$invalidate(6, info = $options.labels.info.replace('{start}', `<b>${start}</b>`).replace('{end}', `<b>${end}</b>`).replace('{rows}', `<b>${rows}</b>`));
    		}
    	};

    	return [
    		ref,
    		classList,
    		rows,
    		end,
    		start,
    		$options,
    		info,
    		$datatableWidth,
    		rowsCount,
    		options,
    		pageNumber,
    		datatableWidth,
    		context,
    		$rowsCount,
    		$pageNumber
    	];
    }

    class PaginationRowCountHTML extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { context: 12, ref: 0, classList: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationRowCountHTML",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get context() {
    		throw new Error("<PaginationRowCountHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set context(value) {
    		throw new Error("<PaginationRowCountHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<PaginationRowCountHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<PaginationRowCountHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<PaginationRowCountHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<PaginationRowCountHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ..\node_modules\.pnpm\svelte-simple-datatables@0.2.3\node_modules\svelte-simple-datatables\src\PaginationRowCount.svelte generated by Svelte v3.52.0 */

    // (23:0) {#if context}
    function create_if_block$7(ctx) {
    	let paginationrowcounthtml;
    	let current;

    	paginationrowcounthtml = new PaginationRowCountHTML({
    			props: {
    				context: /*context*/ ctx[2],
    				ref: /*ref*/ ctx[0],
    				classList: /*classList*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationrowcounthtml.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationrowcounthtml, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationrowcounthtml_changes = {};
    			if (dirty & /*context*/ 4) paginationrowcounthtml_changes.context = /*context*/ ctx[2];
    			if (dirty & /*ref*/ 1) paginationrowcounthtml_changes.ref = /*ref*/ ctx[0];
    			if (dirty & /*classList*/ 2) paginationrowcounthtml_changes.classList = /*classList*/ ctx[1];
    			paginationrowcounthtml.$set(paginationrowcounthtml_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationrowcounthtml.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationrowcounthtml.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationrowcounthtml, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(23:0) {#if context}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*context*/ ctx[2] && create_if_block$7(ctx);

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
    			if (/*context*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*context*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaginationRowCount', slots, []);
    	let { ref = '' } = $$props;
    	let { classList = '' } = $$props;
    	let { id = 'svelte-simple-datatable' } = $$props;
    	let context$1 = null;
    	let loop = 0;

    	const interval = setInterval(
    		() => {
    			loop++;

    			if (context.get(id)) {
    				$$invalidate(2, context$1 = context.get(id));
    				clearInterval(interval);
    			} else if (loop === 20) {
    				clearInterval(interval);
    			}
    		},
    		50
    	);

    	const writable_props = ['ref', 'classList', 'id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PaginationRowCount> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		PaginationRowCountHTML,
    		store: context,
    		ref,
    		classList,
    		id,
    		context: context$1,
    		loop,
    		interval
    	});

    	$$self.$inject_state = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    		if ('context' in $$props) $$invalidate(2, context$1 = $$props.context);
    		if ('loop' in $$props) loop = $$props.loop;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, classList, context$1, id];
    }

    class PaginationRowCount extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { ref: 0, classList: 1, id: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationRowCount",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get ref() {
    		throw new Error("<PaginationRowCount>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<PaginationRowCount>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<PaginationRowCount>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<PaginationRowCount>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<PaginationRowCount>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<PaginationRowCount>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ..\node_modules\.pnpm\svelte-simple-datatables@0.2.3\node_modules\svelte-simple-datatables\src\components\PaginationButtonsHTML.svelte generated by Svelte v3.52.0 */

    const file$5 = "..\\node_modules\\.pnpm\\svelte-simple-datatables@0.2.3\\node_modules\\svelte-simple-datatables\\src\\components\\PaginationButtonsHTML.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    // (81:0) {:else}
    function create_else_block$1(ctx) {
    	let section;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let t5;
    	let button3;
    	let section_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			button0 = element("button");
    			button0.textContent = "❬❬";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "❮";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "❯";
    			t5 = space();
    			button3 = element("button");
    			button3.textContent = "❭❭";
    			attr_dev(button0, "class", "svelte-1nr9gki");
    			toggle_class(button0, "disabled", /*$pageNumber*/ ctx[3] === 1);
    			add_location(button0, file$5, 85, 2, 2056);
    			attr_dev(button1, "class", "svelte-1nr9gki");
    			toggle_class(button1, "disabled", /*$pageNumber*/ ctx[3] === 1);
    			add_location(button1, file$5, 88, 2, 2165);
    			attr_dev(button2, "class", "svelte-1nr9gki");
    			toggle_class(button2, "disabled", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			add_location(button2, file$5, 92, 2, 2283);
    			attr_dev(button3, "class", "svelte-1nr9gki");
    			toggle_class(button3, "disabled", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			add_location(button3, file$5, 96, 2, 2416);
    			attr_dev(section, "class", section_class_value = "dt-pagination-buttons mobile " + /*classList*/ ctx[1] + " svelte-1nr9gki");
    			toggle_class(section, "css", /*$options*/ ctx[4].css);
    			add_location(section, file$5, 81, 1, 1960);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, button0);
    			append_dev(section, t1);
    			append_dev(section, button1);
    			append_dev(section, t3);
    			append_dev(section, button2);
    			append_dev(section, t5);
    			append_dev(section, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler_5*/ ctx[19], false, false, false),
    					listen_dev(button1, "click", /*click_handler_6*/ ctx[20], false, false, false),
    					listen_dev(button2, "click", /*click_handler_7*/ ctx[21], false, false, false),
    					listen_dev(button3, "click", /*click_handler_8*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$pageNumber*/ 8) {
    				toggle_class(button0, "disabled", /*$pageNumber*/ ctx[3] === 1);
    			}

    			if (dirty & /*$pageNumber*/ 8) {
    				toggle_class(button1, "disabled", /*$pageNumber*/ ctx[3] === 1);
    			}

    			if (dirty & /*$pageNumber, pageCount*/ 12) {
    				toggle_class(button2, "disabled", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			}

    			if (dirty & /*$pageNumber, pageCount*/ 12) {
    				toggle_class(button3, "disabled", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			}

    			if (dirty & /*classList*/ 2 && section_class_value !== (section_class_value = "dt-pagination-buttons mobile " + /*classList*/ ctx[1] + " svelte-1nr9gki")) {
    				attr_dev(section, "class", section_class_value);
    			}

    			if (dirty & /*classList, $options*/ 18) {
    				toggle_class(section, "css", /*$options*/ ctx[4].css);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(81:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:0) {#if $datatableWidth > 600}
    function create_if_block$6(ctx) {
    	let section;
    	let button0;
    	let raw0_value = /*$options*/ ctx[4].labels.previous + "";
    	let t0;
    	let button1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let button2;
    	let raw1_value = /*$options*/ ctx[4].labels.next + "";
    	let section_class_value;
    	let mounted;
    	let dispose;
    	let if_block0 = /*pageCount*/ ctx[2].length > 6 && /*$pageNumber*/ ctx[3] >= 5 && create_if_block_4$1(ctx);
    	let each_value = /*buttons*/ ctx[5];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	let if_block1 = /*pageCount*/ ctx[2].length > 6 && /*$pageNumber*/ ctx[3] <= /*pageCount*/ ctx[2].length - 3 && create_if_block_2$3(ctx);
    	let if_block2 = /*pageCount*/ ctx[2].length > 1 && create_if_block_1$4(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			button0 = element("button");
    			t0 = space();
    			button1 = element("button");
    			button1.textContent = "1";
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			if (if_block1) if_block1.c();
    			t5 = space();
    			if (if_block2) if_block2.c();
    			t6 = space();
    			button2 = element("button");
    			attr_dev(button0, "class", "text svelte-1nr9gki");
    			toggle_class(button0, "disabled", /*$pageNumber*/ ctx[3] === 1);
    			add_location(button0, file$5, 34, 2, 858);
    			attr_dev(button1, "class", "svelte-1nr9gki");
    			toggle_class(button1, "active", /*$pageNumber*/ ctx[3] === 1);
    			add_location(button1, file$5, 41, 2, 1026);
    			attr_dev(button2, "class", "text svelte-1nr9gki");
    			toggle_class(button2, "disabled", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			add_location(button2, file$5, 72, 2, 1760);
    			attr_dev(section, "class", section_class_value = "dt-pagination-buttons " + /*classList*/ ctx[1] + " svelte-1nr9gki");
    			attr_dev(section, "ref", /*ref*/ ctx[0]);
    			toggle_class(section, "css", /*$options*/ ctx[4].css);
    			add_location(section, file$5, 29, 1, 760);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, button0);
    			button0.innerHTML = raw0_value;
    			append_dev(section, t0);
    			append_dev(section, button1);
    			append_dev(section, t2);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			append_dev(section, t4);
    			if (if_block1) if_block1.m(section, null);
    			append_dev(section, t5);
    			if (if_block2) if_block2.m(section, null);
    			append_dev(section, t6);
    			append_dev(section, button2);
    			button2.innerHTML = raw1_value;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[14], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[15], false, false, false),
    					listen_dev(button2, "click", /*click_handler_4*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$options*/ 16 && raw0_value !== (raw0_value = /*$options*/ ctx[4].labels.previous + "")) button0.innerHTML = raw0_value;
    			if (dirty & /*$pageNumber*/ 8) {
    				toggle_class(button0, "disabled", /*$pageNumber*/ ctx[3] === 1);
    			}

    			if (dirty & /*$pageNumber*/ 8) {
    				toggle_class(button1, "active", /*$pageNumber*/ ctx[3] === 1);
    			}

    			if (/*pageCount*/ ctx[2].length > 6 && /*$pageNumber*/ ctx[3] >= 5) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					if_block0.m(section, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*$pageNumber, buttons, setPage, pageCount*/ 2092) {
    				each_value = /*buttons*/ ctx[5];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(section, t4);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*pageCount*/ ctx[2].length > 6 && /*$pageNumber*/ ctx[3] <= /*pageCount*/ ctx[2].length - 3) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_2$3(ctx);
    					if_block1.c();
    					if_block1.m(section, t5);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*pageCount*/ ctx[2].length > 1) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1$4(ctx);
    					if_block2.c();
    					if_block2.m(section, t6);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*$options*/ 16 && raw1_value !== (raw1_value = /*$options*/ ctx[4].labels.next + "")) button2.innerHTML = raw1_value;
    			if (dirty & /*$pageNumber, pageCount*/ 12) {
    				toggle_class(button2, "disabled", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			}

    			if (dirty & /*classList*/ 2 && section_class_value !== (section_class_value = "dt-pagination-buttons " + /*classList*/ ctx[1] + " svelte-1nr9gki")) {
    				attr_dev(section, "class", section_class_value);
    			}

    			if (dirty & /*ref*/ 1) {
    				attr_dev(section, "ref", /*ref*/ ctx[0]);
    			}

    			if (dirty & /*classList, $options*/ 18) {
    				toggle_class(section, "css", /*$options*/ ctx[4].css);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(29:0) {#if $datatableWidth > 600}",
    		ctx
    	});

    	return block;
    }

    // (45:2) {#if pageCount.length > 6 && $pageNumber >= 5}
    function create_if_block_4$1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "...";
    			attr_dev(button, "class", "ellipse svelte-1nr9gki");
    			add_location(button, file$5, 45, 3, 1169);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(45:2) {#if pageCount.length > 6 && $pageNumber >= 5}",
    		ctx
    	});

    	return block;
    }

    // (50:3) {#if n > 0 && n < pageCount.length - 1}
    function create_if_block_3$1(ctx) {
    	let button;
    	let t_value = /*n*/ ctx[24] + 1 + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[16](/*n*/ ctx[24]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "svelte-1nr9gki");
    			toggle_class(button, "active", /*$pageNumber*/ ctx[3] === /*n*/ ctx[24] + 1);
    			add_location(button, file$5, 50, 4, 1290);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*buttons*/ 32 && t_value !== (t_value = /*n*/ ctx[24] + 1 + "")) set_data_dev(t, t_value);

    			if (dirty & /*$pageNumber, buttons*/ 40) {
    				toggle_class(button, "active", /*$pageNumber*/ ctx[3] === /*n*/ ctx[24] + 1);
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
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(50:3) {#if n > 0 && n < pageCount.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (49:2) {#each buttons as n}
    function create_each_block$2(ctx) {
    	let if_block_anchor;
    	let if_block = /*n*/ ctx[24] > 0 && /*n*/ ctx[24] < /*pageCount*/ ctx[2].length - 1 && create_if_block_3$1(ctx);

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
    			if (/*n*/ ctx[24] > 0 && /*n*/ ctx[24] < /*pageCount*/ ctx[2].length - 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3$1(ctx);
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
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(49:2) {#each buttons as n}",
    		ctx
    	});

    	return block;
    }

    // (60:2) {#if pageCount.length > 6 && $pageNumber <= pageCount.length - 3}
    function create_if_block_2$3(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "...";
    			attr_dev(button, "class", "ellipse svelte-1nr9gki");
    			add_location(button, file$5, 60, 3, 1511);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(60:2) {#if pageCount.length > 6 && $pageNumber <= pageCount.length - 3}",
    		ctx
    	});

    	return block;
    }

    // (64:2) {#if pageCount.length > 1}
    function create_if_block_1$4(ctx) {
    	let button;
    	let t_value = /*pageCount*/ ctx[2].length + "";
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "class", "svelte-1nr9gki");
    			toggle_class(button, "active", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
    			add_location(button, file$5, 64, 3, 1593);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_3*/ ctx[17], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pageCount*/ 4 && t_value !== (t_value = /*pageCount*/ ctx[2].length + "")) set_data_dev(t, t_value);

    			if (dirty & /*$pageNumber, pageCount*/ 12) {
    				toggle_class(button, "active", /*$pageNumber*/ ctx[3] === /*pageCount*/ ctx[2].length);
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
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(64:2) {#if pageCount.length > 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*$datatableWidth*/ ctx[6] > 600) return create_if_block$6;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	let pageCount;
    	let buttons;
    	let $pageNumber;
    	let $options;
    	let $rowsCount;
    	let $datatableWidth;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaginationButtonsHTML', slots, []);
    	let { context } = $$props;
    	let { ref = '' } = $$props;
    	let { classList = '' } = $$props;
    	const rowsCount = context.getRowsCount();
    	validate_store(rowsCount, 'rowsCount');
    	component_subscribe($$self, rowsCount, value => $$invalidate(13, $rowsCount = value));
    	const options = context.getOptions();
    	validate_store(options, 'options');
    	component_subscribe($$self, options, value => $$invalidate(4, $options = value));
    	const pageNumber = context.getPageNumber();
    	validate_store(pageNumber, 'pageNumber');
    	component_subscribe($$self, pageNumber, value => $$invalidate(3, $pageNumber = value));
    	const datatableWidth = context.getDatatableWidth();
    	validate_store(datatableWidth, 'datatableWidth');
    	component_subscribe($$self, datatableWidth, value => $$invalidate(6, $datatableWidth = value));

    	const slice = (arr, page) => {
    		if (page < 5) {
    			return arr.slice(0, 5);
    		} else if (page > arr.length - 4) {
    			return arr.slice(arr.length - 5, arr.length);
    		}

    		return arr.slice(page - 2, page + 1);
    	};

    	const setPage = number => {
    		pageNumber.set(number);
    		context.getColumns().redraw();
    	};

    	$$self.$$.on_mount.push(function () {
    		if (context === undefined && !('context' in $$props || $$self.$$.bound[$$self.$$.props['context']])) {
    			console.warn("<PaginationButtonsHTML> was created without expected prop 'context'");
    		}
    	});

    	const writable_props = ['context', 'ref', 'classList'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PaginationButtonsHTML> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => setPage($pageNumber - 1);
    	const click_handler_1 = () => setPage(1);
    	const click_handler_2 = n => setPage(n + 1);
    	const click_handler_3 = () => setPage(pageCount.length);
    	const click_handler_4 = () => setPage($pageNumber + 1);
    	const click_handler_5 = () => setPage(1);
    	const click_handler_6 = () => setPage($pageNumber - 1);
    	const click_handler_7 = () => setPage($pageNumber + 1);
    	const click_handler_8 = () => setPage(pageCount.length);

    	$$self.$$set = $$props => {
    		if ('context' in $$props) $$invalidate(12, context = $$props.context);
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    	};

    	$$self.$capture_state = () => ({
    		context,
    		ref,
    		classList,
    		rowsCount,
    		options,
    		pageNumber,
    		datatableWidth,
    		slice,
    		setPage,
    		pageCount,
    		buttons,
    		$pageNumber,
    		$options,
    		$rowsCount,
    		$datatableWidth
    	});

    	$$self.$inject_state = $$props => {
    		if ('context' in $$props) $$invalidate(12, context = $$props.context);
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('pageCount' in $$props) $$invalidate(2, pageCount = $$props.pageCount);
    		if ('buttons' in $$props) $$invalidate(5, buttons = $$props.buttons);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$rowsCount, $options*/ 8208) {
    			$$invalidate(2, pageCount = Array.from(Array(Math.ceil($rowsCount / $options.rowsPerPage)).keys()));
    		}

    		if ($$self.$$.dirty & /*pageCount, $pageNumber*/ 12) {
    			$$invalidate(5, buttons = slice(pageCount, $pageNumber));
    		}
    	};

    	return [
    		ref,
    		classList,
    		pageCount,
    		$pageNumber,
    		$options,
    		buttons,
    		$datatableWidth,
    		rowsCount,
    		options,
    		pageNumber,
    		datatableWidth,
    		setPage,
    		context,
    		$rowsCount,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8
    	];
    }

    class PaginationButtonsHTML extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { context: 12, ref: 0, classList: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationButtonsHTML",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get context() {
    		throw new Error("<PaginationButtonsHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set context(value) {
    		throw new Error("<PaginationButtonsHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ref() {
    		throw new Error("<PaginationButtonsHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<PaginationButtonsHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<PaginationButtonsHTML>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<PaginationButtonsHTML>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ..\node_modules\.pnpm\svelte-simple-datatables@0.2.3\node_modules\svelte-simple-datatables\src\PaginationButtons.svelte generated by Svelte v3.52.0 */

    // (23:0) {#if context}
    function create_if_block$5(ctx) {
    	let paginationbuttonshtml;
    	let current;

    	paginationbuttonshtml = new PaginationButtonsHTML({
    			props: {
    				context: /*context*/ ctx[2],
    				ref: /*ref*/ ctx[0],
    				classList: /*classList*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationbuttonshtml.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationbuttonshtml, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationbuttonshtml_changes = {};
    			if (dirty & /*context*/ 4) paginationbuttonshtml_changes.context = /*context*/ ctx[2];
    			if (dirty & /*ref*/ 1) paginationbuttonshtml_changes.ref = /*ref*/ ctx[0];
    			if (dirty & /*classList*/ 2) paginationbuttonshtml_changes.classList = /*classList*/ ctx[1];
    			paginationbuttonshtml.$set(paginationbuttonshtml_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationbuttonshtml.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationbuttonshtml.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationbuttonshtml, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(23:0) {#if context}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*context*/ ctx[2] && create_if_block$5(ctx);

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
    			if (/*context*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*context*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaginationButtons', slots, []);
    	let { ref = '' } = $$props;
    	let { classList = '' } = $$props;
    	let { id = 'svelte-simple-datatable' } = $$props;
    	let context$1 = null;
    	let loop = 0;

    	const interval = setInterval(
    		() => {
    			loop++;

    			if (context.get(id)) {
    				$$invalidate(2, context$1 = context.get(id));
    				clearInterval(interval);
    			} else if (loop === 24) {
    				clearInterval(interval);
    			}
    		},
    		50
    	);

    	const writable_props = ['ref', 'classList', 'id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PaginationButtons> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		PaginationButtonsHTML,
    		store: context,
    		ref,
    		classList,
    		id,
    		context: context$1,
    		loop,
    		interval
    	});

    	$$self.$inject_state = $$props => {
    		if ('ref' in $$props) $$invalidate(0, ref = $$props.ref);
    		if ('classList' in $$props) $$invalidate(1, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(3, id = $$props.id);
    		if ('context' in $$props) $$invalidate(2, context$1 = $$props.context);
    		if ('loop' in $$props) loop = $$props.loop;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ref, classList, context$1, id];
    }

    class PaginationButtons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { ref: 0, classList: 1, id: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationButtons",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get ref() {
    		throw new Error("<PaginationButtons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ref(value) {
    		throw new Error("<PaginationButtons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<PaginationButtons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<PaginationButtons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<PaginationButtons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<PaginationButtons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ..\node_modules\.pnpm\svelte-simple-datatables@0.2.3\node_modules\svelte-simple-datatables\src\components\Pagination.svelte generated by Svelte v3.52.0 */
    const file$4 = "..\\node_modules\\.pnpm\\svelte-simple-datatables@0.2.3\\node_modules\\svelte-simple-datatables\\src\\components\\Pagination.svelte";

    // (9:0) {#if $options.pagination && ($options.blocks.paginationRowCount || $options.blocks.paginationButtons)}
    function create_if_block$4(ctx) {
    	let section;
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_2$2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$options*/ ctx[2].blocks.paginationRowCount) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*$options*/ ctx[2].blocks.paginationButtons && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(section, "class", "dt-pagination svelte-1thvc3t");
    			toggle_class(section, "css", /*$options*/ ctx[2].css);
    			add_location(section, file$4, 9, 1, 293);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if_blocks[current_block_type_index].m(section, null);
    			append_dev(section, t);
    			if (if_block1) if_block1.m(section, null);
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
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(section, t);
    			}

    			if (/*$options*/ ctx[2].blocks.paginationButtons) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$options*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(section, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$options*/ 4) {
    				toggle_class(section, "css", /*$options*/ ctx[2].css);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(9:0) {#if $options.pagination && ($options.blocks.paginationRowCount || $options.blocks.paginationButtons)}",
    		ctx
    	});

    	return block;
    }

    // (13:2) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file$4, 13, 3, 441);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(13:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:2) {#if $options.blocks.paginationRowCount}
    function create_if_block_2$2(ctx) {
    	let paginationrowcount;
    	let current;

    	paginationrowcount = new PaginationRowCount({
    			props: { id: /*id*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationrowcount.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationrowcount, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationrowcount_changes = {};
    			if (dirty & /*id*/ 1) paginationrowcount_changes.id = /*id*/ ctx[0];
    			paginationrowcount.$set(paginationrowcount_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationrowcount.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationrowcount.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationrowcount, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(11:2) {#if $options.blocks.paginationRowCount}",
    		ctx
    	});

    	return block;
    }

    // (16:2) {#if $options.blocks.paginationButtons}
    function create_if_block_1$3(ctx) {
    	let paginationbuttons;
    	let current;

    	paginationbuttons = new PaginationButtons({
    			props: { id: /*id*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginationbuttons.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginationbuttons, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const paginationbuttons_changes = {};
    			if (dirty & /*id*/ 1) paginationbuttons_changes.id = /*id*/ ctx[0];
    			paginationbuttons.$set(paginationbuttons_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationbuttons.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationbuttons.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginationbuttons, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(16:2) {#if $options.blocks.paginationButtons}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$options*/ ctx[2].pagination && (/*$options*/ ctx[2].blocks.paginationRowCount || /*$options*/ ctx[2].blocks.paginationButtons) && create_if_block$4(ctx);

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
    			if (/*$options*/ ctx[2].pagination && (/*$options*/ ctx[2].blocks.paginationRowCount || /*$options*/ ctx[2].blocks.paginationButtons)) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$options*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $options,
    		$$unsubscribe_options = noop,
    		$$subscribe_options = () => ($$unsubscribe_options(), $$unsubscribe_options = subscribe(options, $$value => $$invalidate(2, $options = $$value)), options);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_options());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pagination', slots, []);
    	let { id } = $$props;
    	let { options } = $$props;
    	validate_store(options, 'options');
    	$$subscribe_options();

    	$$self.$$.on_mount.push(function () {
    		if (id === undefined && !('id' in $$props || $$self.$$.bound[$$self.$$.props['id']])) {
    			console.warn("<Pagination> was created without expected prop 'id'");
    		}

    		if (options === undefined && !('options' in $$props || $$self.$$.bound[$$self.$$.props['options']])) {
    			console.warn("<Pagination> was created without expected prop 'options'");
    		}
    	});

    	const writable_props = ['id', 'options'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pagination> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('options' in $$props) $$subscribe_options($$invalidate(1, options = $$props.options));
    	};

    	$$self.$capture_state = () => ({
    		PaginationRowCount,
    		PaginationButtons,
    		id,
    		options,
    		$options
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('options' in $$props) $$subscribe_options($$invalidate(1, options = $$props.options));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, options, $options];
    }

    class Pagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { id: 0, options: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pagination",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get id() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<Pagination>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Pagination>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const header = {
        removeOriginalThead: (id) => {
            setTimeout(() => {
                const thead = document.querySelector(`#${id} table thead`);
                const originHeight = thead.getBoundingClientRect().height;
                thead.parentNode.style.marginTop = '-' + (originHeight) + 'px';
                thead.style.visibility = 'hidden';
            }, 50);
        },
        getOrginalTHeadClassList: (id) => {
            return document.querySelector(`#${id} table thead`).classList
        },
    };

    /* ..\node_modules\.pnpm\svelte-simple-datatables@0.2.3\node_modules\svelte-simple-datatables\src\components\StickyHeader.svelte generated by Svelte v3.52.0 */
    const file$3 = "..\\node_modules\\.pnpm\\svelte-simple-datatables@0.2.3\\node_modules\\svelte-simple-datatables\\src\\components\\StickyHeader.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (24:3) {#each $columns as th}
    function create_each_block_1(ctx) {
    	let th;
    	let html_tag;
    	let raw_value = /*th*/ ctx[8].html + "";
    	let span;
    	let t;
    	let th_class_value;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[6](/*th*/ ctx[8], ...args);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			html_tag = new HtmlTag(false);
    			span = element("span");
    			t = space();
    			html_tag.a = span;
    			attr_dev(span, "class", "svelte-1x5myu9");
    			add_location(span, file$3, 31, 20, 745);
    			attr_dev(th, "nowrap", "");
    			set_style(th, "min-width", /*th*/ ctx[8].minWidth + "px");
    			attr_dev(th, "class", th_class_value = "" + (null_to_empty(/*th*/ ctx[8].classList) + " svelte-1x5myu9"));
    			toggle_class(th, "sortable", /*th*/ ctx[8].key && /*$options*/ ctx[3].sortable === true);
    			add_location(th, file$3, 24, 4, 517);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			html_tag.m(raw_value, th);
    			append_dev(th, span);
    			append_dev(th, t);

    			if (!mounted) {
    				dispose = listen_dev(th, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$columns*/ 16 && raw_value !== (raw_value = /*th*/ ctx[8].html + "")) html_tag.p(raw_value);

    			if (dirty & /*$columns*/ 16) {
    				set_style(th, "min-width", /*th*/ ctx[8].minWidth + "px");
    			}

    			if (dirty & /*$columns*/ 16 && th_class_value !== (th_class_value = "" + (null_to_empty(/*th*/ ctx[8].classList) + " svelte-1x5myu9"))) {
    				attr_dev(th, "class", th_class_value);
    			}

    			if (dirty & /*$columns, $columns, $options*/ 24) {
    				toggle_class(th, "sortable", /*th*/ ctx[8].key && /*$options*/ ctx[3].sortable === true);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(24:3) {#each $columns as th}",
    		ctx
    	});

    	return block;
    }

    // (36:2) {#if $options.columnFilter === true}
    function create_if_block$3(ctx) {
    	let tr;
    	let each_value = /*$columns*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tr, file$3, 36, 3, 830);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$columns, $options, columns*/ 26) {
    				each_value = /*$columns*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(36:2) {#if $options.columnFilter === true}",
    		ctx
    	});

    	return block;
    }

    // (40:6) {#if th.key}
    function create_if_block_1$2(ctx) {
    	let input;
    	let input_placeholder_value;
    	let mounted;
    	let dispose;

    	function input_handler(...args) {
    		return /*input_handler*/ ctx[7](/*th*/ ctx[8], ...args);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", input_placeholder_value = /*$options*/ ctx[3].labels.filter);
    			attr_dev(input, "class", "browser-default svelte-1x5myu9");
    			add_location(input, file$3, 40, 7, 955);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$options*/ 8 && input_placeholder_value !== (input_placeholder_value = /*$options*/ ctx[3].labels.filter)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(40:6) {#if th.key}",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#each $columns as th}
    function create_each_block$1(ctx) {
    	let th;
    	let t;
    	let if_block = /*th*/ ctx[8].key && create_if_block_1$2(ctx);

    	const block = {
    		c: function create() {
    			th = element("th");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(th, "class", "filter svelte-1x5myu9");
    			set_style(th, "width", /*th*/ ctx[8].width);
    			set_style(th, "height", "25px");
    			add_location(th, file$3, 38, 5, 869);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			if (if_block) if_block.m(th, null);
    			append_dev(th, t);
    		},
    		p: function update(ctx, dirty) {
    			if (/*th*/ ctx[8].key) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$2(ctx);
    					if_block.c();
    					if_block.m(th, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*$columns*/ 16) {
    				set_style(th, "width", /*th*/ ctx[8].width);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(38:4) {#each $columns as th}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let section;
    	let thead;
    	let tr;
    	let t;
    	let thead_class_value;
    	let each_value_1 = /*$columns*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block = /*$options*/ ctx[3].columnFilter === true && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			thead = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			add_location(tr, file$3, 22, 2, 480);
    			attr_dev(thead, "class", thead_class_value = "" + (null_to_empty(/*theadClassList*/ ctx[2]) + " svelte-1x5myu9"));
    			add_location(thead, file$3, 21, 1, 446);
    			attr_dev(section, "class", "dt-header svelte-1x5myu9");
    			toggle_class(section, "sortable", /*$options*/ ctx[3].sortable === true);
    			toggle_class(section, "css", /*$options*/ ctx[3].css);
    			add_location(section, file$3, 16, 0, 339);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, thead);
    			append_dev(thead, tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(thead, t);
    			if (if_block) if_block.m(thead, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$columns, $options, columns*/ 26) {
    				each_value_1 = /*$columns*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (/*$options*/ ctx[3].columnFilter === true) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(thead, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*theadClassList*/ 4 && thead_class_value !== (thead_class_value = "" + (null_to_empty(/*theadClassList*/ ctx[2]) + " svelte-1x5myu9"))) {
    				attr_dev(thead, "class", thead_class_value);
    			}

    			if (dirty & /*$options*/ 8) {
    				toggle_class(section, "sortable", /*$options*/ ctx[3].sortable === true);
    			}

    			if (dirty & /*$options*/ 8) {
    				toggle_class(section, "css", /*$options*/ ctx[3].css);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
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

    function instance$3($$self, $$props, $$invalidate) {
    	let $options,
    		$$unsubscribe_options = noop,
    		$$subscribe_options = () => ($$unsubscribe_options(), $$unsubscribe_options = subscribe(options, $$value => $$invalidate(3, $options = $$value)), options);

    	let $columns,
    		$$unsubscribe_columns = noop,
    		$$subscribe_columns = () => ($$unsubscribe_columns(), $$unsubscribe_columns = subscribe(columns, $$value => $$invalidate(4, $columns = $$value)), columns);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_options());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_columns());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StickyHeader', slots, []);
    	let { id = 'svelte-simple-datatable' } = $$props;
    	let { options } = $$props;
    	validate_store(options, 'options');
    	$$subscribe_options();
    	let { columns } = $$props;
    	validate_store(columns, 'columns');
    	$$subscribe_columns();
    	let theadClassList;

    	onMount(() => {
    		columns.draw();
    		header.removeOriginalThead(id);
    		$$invalidate(2, theadClassList = header.getOrginalTHeadClassList(id));
    	});

    	$$self.$$.on_mount.push(function () {
    		if (options === undefined && !('options' in $$props || $$self.$$.bound[$$self.$$.props['options']])) {
    			console.warn("<StickyHeader> was created without expected prop 'options'");
    		}

    		if (columns === undefined && !('columns' in $$props || $$self.$$.bound[$$self.$$.props['columns']])) {
    			console.warn("<StickyHeader> was created without expected prop 'columns'");
    		}
    	});

    	const writable_props = ['id', 'options', 'columns'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StickyHeader> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (th, e) => columns.sort(e.target, th.key);
    	const input_handler = (th, e) => columns.filter(th.key, e.target.value);

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(5, id = $$props.id);
    		if ('options' in $$props) $$subscribe_options($$invalidate(0, options = $$props.options));
    		if ('columns' in $$props) $$subscribe_columns($$invalidate(1, columns = $$props.columns));
    	};

    	$$self.$capture_state = () => ({
    		header,
    		onMount,
    		id,
    		options,
    		columns,
    		theadClassList,
    		$options,
    		$columns
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(5, id = $$props.id);
    		if ('options' in $$props) $$subscribe_options($$invalidate(0, options = $$props.options));
    		if ('columns' in $$props) $$subscribe_columns($$invalidate(1, columns = $$props.columns));
    		if ('theadClassList' in $$props) $$invalidate(2, theadClassList = $$props.theadClassList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		options,
    		columns,
    		theadClassList,
    		$options,
    		$columns,
    		id,
    		click_handler,
    		input_handler
    	];
    }

    class StickyHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { id: 5, options: 0, columns: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StickyHeader",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get id() {
    		throw new Error("<StickyHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<StickyHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<StickyHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<StickyHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columns() {
    		throw new Error("<StickyHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columns(value) {
    		throw new Error("<StickyHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class options
    {
        create()
        {
            const {subscribe, set } = writable({
                sortable: true,
                pagination: true,
                rowsPerPage: 50,
                columnFilter: false,
                scrollY: true,
                css: true,
                labels: {
                    search: 'Search...',
                    filter: 'Filter',
                    noRows: 'No entries to found',
                    info: 'Showing {start} to {end} of {rows} entries',
                    previous: 'Previous',
                    next: 'Next',
                },
                blocks: {
                    searchInput: true, 
                    paginationButtons: true,
                    paginationRowCount: true,
                }
            });
            return {
                subscribe, set, 
                get: (self) => {
                    let $store;
                    self.subscribe(store => $store = store);
                    return $store
                },
                parse: (opt) => {
                    opt.labels = opt.labels ?? {};
                    const labels = {
                        search:   typeof opt.labels.search   === 'string' ? opt.labels.search   : 'Search...',
                        filter:   typeof opt.labels.filter   === 'string' ? opt.labels.filter   : 'Filter',
                        noRows:   typeof opt.labels.noRows   === 'string' ? opt.labels.noRows   : 'No entries to found',
                        info:     typeof opt.labels.info     === 'string' ? opt.labels.info     : 'Showing {start} to {end} of {rows} entries',
                        previous: typeof opt.labels.previous === 'string' ? opt.labels.previous : 'Previous',
                        next:     typeof opt.labels.next     === 'string' ? opt.labels.next     : 'Next',                
                    };   
                    opt.blocks = opt.blocks ?? {};
                    const blocks = {
                        searchInput:        typeof opt.blocks.searchInput        === 'boolean' ? opt.blocks.searchInput        : true, 
                        paginationButtons:  typeof opt.blocks.paginationButtons  === 'boolean' ? opt.blocks.paginationButtons  : true,
                        paginationRowCount: typeof opt.blocks.paginationRowCount === 'boolean' ? opt.blocks.paginationRowCount : true,
                    };
                    return {
                        sortable:     typeof opt.sortable       === 'boolean' ? opt.sortable      : true,
                        pagination:   typeof opt.pagination     === 'boolean' ? opt.pagination    : true,
                        rowsPerPage:  typeof opt.rowsPerPage    === 'number'  ? opt.rowsPerPage   : 50,
                        columnFilter: typeof opt.columnFilter   === 'boolean' ? opt.columnFilter  : false, 
                        scrollY:      typeof opt.scrollY        === 'boolean' ? opt.scrollY       : true, 
                        css:          typeof opt.css            === 'boolean' ? opt.css           : true, 
                        labels: labels,
                        blocks: blocks
                    }
                }
            }
        }
    }

    class States
    {
        create(options, identifier = null) 
        {
            const id = this.createId(identifier);
            const rowsCount = this.createRowsCount();
            return {
                rowsCount: rowsCount,
                id: id,
                pageNumber: this.createPageNumber(id, options, rowsCount),
                datatableWidth: this.createDatatableWidth()

            }
        }

        createPageNumber(id, options, rowsCount)
        {
            const { subscribe, update } = writable(1);
            return {
                subscribe, update,
                set: (number) => update( store => {
                    let $rowsPerPage, $rowsCount;
                    rowsCount.subscribe(store => $rowsCount = store);
                    options.subscribe(store => $rowsPerPage = store.rowsPerPage);
        
                    if ( number >= 1 && number <= Math.ceil($rowsCount / $rowsPerPage) ) {
                        store = parseInt(number);
                    }
                    document.querySelector(`#${id.get()} .dt-table`).scrollTop = 0;
                    return store
                })
            }
        }

        createId(identifier = null)
        {
            const id = identifier ?? 'ssd-' + (Math.random() + 1).toString(36).substring(5);
    		const { subscribe } = readable(id);
    		return {
    			subscribe,
    			get: () => { return id }
    		}
        }

        createRowsCount()
        {
            return writable(0)
        }

        createDatatableWidth()
        {
            return writable(null)
        }
    }

    class Filters 
    {
        create() 
        {
            return {
                globalFilter: this.createGlobalFilter(),
                localFilters: this.createLocalFilters()
            }
        }
        
        createLocalFilters() 
        {
            const { subscribe, update } = writable([]);
            return {
                subscribe, update,
                add: (key, value) => update(store => {
                    const filter = {key: key, value: value}; 
                    store = store.filter(item => { return item.key !== key && item.value.length > 0 });
                    store.push(filter);
                    return store
                }),
                remove: () => update(store => [])
            }
        }

        createGlobalFilter()
        {
            const { subscribe, update } = writable(null);
            return {
                subscribe, 
                set: (value) => update(store => {
                    store = (value.length > 0) ? value : null;
                    return store
                }),
                remove: () => update(store => null)
            }
        }
    }

    class Data 
    {
        create(states, filters, options)
        {
            const data = this.createData();
            const filtered = this.createFiltered(data, states.rowsCount, filters.globalFilter, filters.localFilters);
            const rows = this.createRows(filtered, options, states.pageNumber);
            return {
                data: data,
                filtered: filtered,
                rows: rows
            }
        }

        createData()
        {
            const { subscribe, set, update } = writable([]);
            return {
                subscribe, set,
                sortAsc: (key) => update(store => {
                    try {
                        store.sort( (a, b) => {
                            if ( typeof( key(b) ) === "boolean" ) {
                                return key(a) ? 1 : -1
                            } else {
                                return key(b).localeCompare(key(a)) 
                            }									
                        });
        
                        return store
                    } catch (e) {
                        return store.sort( (a, b) => parseFloat(key(b)) - parseFloat(key(a)))
                    }
                    //return store.sort( (a, b) => key(b).localeCompare(key(a)) )
                    
                }),
                sortDesc: (key) => update(store => {
                    try {
                        store.sort( (a, b) => {
                            if ( typeof(key(b) ) === "boolean" ) {
                                return key(a) ? -1 : 1
                            } else {
                                return key(a).localeCompare(key(b)) 
                            }									
                        });
        
                        return store					
                    } catch (e) {
                        return store.sort( (a, b) => parseFloat(key(a)) - parseFloat(key(b)))
                    }
                    //return store.sort( (a, b) => key(a).localeCompare(key(b)) )
                }),
            }
        }

        createFiltered(data, rowsCount, globalFilter, localFilters) 
        {
            return derived(
                [data, globalFilter, localFilters],
                ([$data, $globalFilter, $localFilters]) => {
                    if ($globalFilter) {
                        $data = $data.filter( item => {
                            return Object.keys(item).some( k => {
                                return item[k].toString().toLowerCase().indexOf($globalFilter.toString().toLowerCase()) > -1
                            })
                        });
                    }
                    if ($localFilters.length > 0) {
                        $localFilters.forEach(filter => {
                            return $data = $data.filter( item => filter.key(item).toString().toLowerCase().indexOf(filter.value.toString().toLowerCase()) > -1)
                        });
                    }
                    rowsCount.set($data.length);
                    return $data
                } 	
            )
        }

        createRows(filtered, options, pageNumber)
        {
            return derived(
                [filtered, options, pageNumber],
                ([$filtered, $options, $pageNumber]) => {
                    if (!$options.pagination) {
                        return $filtered
                    }
                    return $filtered.slice( ($pageNumber - 1) * $options.rowsPerPage, $pageNumber * $options.rowsPerPage) 
                }
            ) 
        }
    }

    class Columns 
    {
        create(data, states, filters, options)
        {
    		const id = states.id;
    		this.id = id.get();
    		const pageNumber = states.pageNumber;
    		const localFilters = filters.localFilters;
            const { subscribe, set, update } = writable([]);
    		return {
    			subscribe, set, update,
    			get: (self) => {
    				let $columns;
    				self.subscribe(store => $columns = store);
    				return $columns
    			},
    			sort: (element, key) => {
    				if (options.get(options).sortable !== true || typeof key === 'undefined') {
    					return
    				}
    				if (
    					element.classList.contains('sortable') &&
    					element.classList.contains('asc')
    				) {
    					Array.from(element.parentNode.children).forEach((item) =>
    						item.classList.remove('asc', 'desc')
    					);
    					element.classList.add('desc');
    					data.sortDesc(key);
    					pageNumber.set(1);
    				} else {
    					Array.from(element.parentNode.children).forEach((item) =>
    						item.classList.remove('desc', 'asc')
    					);
    					element.classList.add('asc');
    					data.sortAsc(key);
    					pageNumber.set(1);
    				}
    				this.get(this.id).redraw();
    			},
    			filter: (key, value) => {
    				pageNumber.set(1);
    				localFilters.add(key, value);
    				this.get(this.id).redraw();
    			},
    			draw: () => {
    				setTimeout(() => {
    					const tbody = document.querySelector(`#${id.get()} table tbody tr`);
    					if (tbody === null) return
    					const thead = document.querySelectorAll(`#${id.get()} .dt-header thead tr`);
    					const $columns = this.getData(this.id);

    					thead[0].children[0];
    					Array.from(tbody.children)[0];

    					thead.forEach(tr => {
    						let i = 0;
    						Array.from(tbody.children).forEach(td => {
    							let th = tr.children[i];
    							let thW = th.getBoundingClientRect().width;
    							let tdW = td.getBoundingClientRect().width;
    							if (tdW > thW) { 
    								th.style.minWidth = tdW + 'px';
    								th.style.maxWidth = tdW + 'px';
    								$columns[i].minWidth = tdW;
    							}
    							else {
    								td.style.minWidth = thW + 'px';
    								td.style.maxWidth = thW + 'px';
    								$columns[i].minWidth = thW;
    							} 
    							i++;
    						});
    					});
    				}, 50);	
    			},
    			redraw: () => {
    				if ( options.get(options).scrollY === false ) return
    				
    				setTimeout(() => {
    					const tbody = document.querySelector(`#${id.get()} table tbody tr`);
    					if (tbody === null) return
    					const thead = document.querySelectorAll(`#${id.get()} .dt-header thead tr`);
    					const $columns = this.getData(this.id);
    					thead.forEach(tr => {
    						let i = 0;
    						Array.from(tbody.children).forEach(td => {
    							let th = tr.children[i];
    							let thW = th.getBoundingClientRect().width;
    							let tdW = td.getBoundingClientRect().width;
    							if (tdW > thW) { 
    								th.style.minWidth = tdW + 'px';
    								th.style.maxWidth = tdW + 'px';
    								$columns[i].minWidth = tdW;
    							}
    							else {
    								td.style.minWidth = thW + 'px';
    								td.style.maxWidth = thW + 'px';
    								$columns[i].minWidth = thW;
    							} 
    							i++;
    						});
    					});
    				}, 50);			
    			},
    		}
        }

    	get(id)
    	{
    		return context.get(id).getColumns()
    	}

    	getData(id) 
    	{
    		const columns =  context.get(id).getColumns();
    		return context.get(id).getColumns().get(columns)
    	}
    }

    class Datatable
    {
        constructor(identifier) 
        {
            this.id = identifier;
        }

        create() 
        {
            this.options   = new options().create();
            this.states    = new States().create(this.options, this.id);
            this.filters   = new Filters().create();
            this.data      = new Data().create(this.states, this.filters, this.options);
            this.columns   = new Columns().create(this.data.data, this.states, this.filters, this.options);
            context.add(this);
        }

        get(id)
        {
            return context.get(id)
        }

        getOptions       () { return this?.options                }
        getPageNumber    () { return this?.states.pageNumber      }
        getId            () { return this?.states.id              }
        getRowsCount     () { return this?.states.rowsCount       }
        getDatatableWidth() { return this?.states.datatableWidth  }
        getGlobalFilter  () { return this?.filters.globalFilter   }
        getLocalFilters  () { return this?.filters.localFilters   }
        getData          () { return this?.data.data              }
        getFiltered      () { return this?.data.filtered          }
        getRows          () { return this?.data.rows              }
        getColumns       () { return this?.columns                }

    }

    class Component 
    {
        constructor( id = 'svelte-simple-datatable' )
        {
            this.context = context.get(id);
            this.id = id;
        }
        init() 
        {
            this.setColumns();
            this.resize();
            this.addEventScrollX();
            new ResizeObserver((mutations) => {
                this.resize();
            }).observe(document.querySelector(`#${this.id}`).parentElement);
        }

        reset () 
        {
            this.context.getPageNumber().update(store => 1);
            this.context.getGlobalFilter().remove();
            this.context.getLocalFilters().remove();
            this.context.getColumns().set([]);
        }

        setRows(data)
        {
            for ( const item of data ) {

                for ( const key of Object.keys(item) ) {
                    if (item[key] === null) {
                        item[key] = '';
                    }
                }

            }
            this.context.getData().set(data);
            return
        }

        getSize()
        {
            const parent = document.querySelector(`#${this.id}`).parentNode;
            const style = getComputedStyle(parent);
            const rect = parent.getBoundingClientRect();
            const getNumber = (pxValue) => { return parseFloat(pxValue.replace('px', ''))  }; 
            return {
                parentWidth: rect.width,
                parentHeight: rect.height,
                width: (rect.width - getNumber(style.paddingLeft) - getNumber(style.paddingRight) - getNumber(style.borderLeftWidth) - getNumber(style.borderRightWidth)) / rect.width,
                height: (rect.height - getNumber(style.paddingTop) - getNumber(style.paddingBottom) - getNumber(style.borderTopWidth) - getNumber(style.borderBottomWidth)) / rect.height,
                top: style.paddingTop,
                right: style.paddingRight,
                bottom: style.paddingBottom,
                left: style.paddingLeft
            }
        }

        resize()
        {
            if ( !document.querySelector(`#${this.id}`) ) return
            const size = this.getSize();
            const tableContainer = document.querySelector(`#${this.id} .dt-table`);
            if ( this.getOptions().scrollY ) {
                tableContainer.style.height = this.setTableContainerHeight(size.parentHeight * size.height) + 'px';
                this.context.getColumns().redraw();
            }
            this.context.getDatatableWidth().set( size.parentWidth * size.width );
            if (size.parentWidth * size.width < document.querySelector(`#${this.id} table`).offsetWidth) {
                tableContainer.style.overflowX = 'auto';
            }
        }

        setTableContainerHeight(height) 
        {
            let paginationBlock;
            if (this.getOptions().pagination && (this.getOptions().blocks.paginationButtons || this.getOptions().blocks.paginationRowCount)) {
                paginationBlock = true;
            }
            const calc = [
                (this.getOptions().blocks.searchInput) ? document.querySelector(`#${this.id} .dt-search`).getBoundingClientRect().height : 0,
                (paginationBlock) ? document.querySelector(`#${this.id} .dt-pagination`).getBoundingClientRect().height : 0
            ];
            const sum = (a, b) => a + b;
            document.querySelector(`#${this.id} .dt-table`).style.height = height - calc.reduce(sum) + 'px';
        }

        addEventScrollX()
        {
            if ( this.getOptions().scrollY ) {
                document.querySelector(`#${this.id} .dt-table`).addEventListener('scroll', (e) => {
                    document.querySelector(`#${this.id} .dt-header`).style.left = (-1 * e.target.scrollLeft) + 'px';
                });
            }
        }

        setColumns() {
            setTimeout( () => {
                const columnList = [];
                let i = 0;
                document.querySelectorAll(`#${this.id} table thead th`).forEach(th => {
                    columnList.push({
                        index: i,
                        html: th.innerHTML,
                        key: this.getKey(th.dataset.key),
                        sort: null,
                        classList: th.classList,
                        minWidth: th.getBoundingClientRect().width
                    });
                    th.addEventListener('click', (e) => {
                        this.context.getColumns().sort(e.target, this.getKey(th.dataset.key));
                    }, true);
                    i++;
                });
                this.context.getColumns().set(columnList);
            }, 25);
        }

        getKey(key) 
        {
            if (!key)  return 
            if (key && key.indexOf('=>') > 0) {
                return new Function(`'use strict';return (${key})`)()
            }
            return (x) => x[key]
        }

        getOptions() 
        {
            return this.context.getOptions().get(this.context.getOptions())
        }
    }

    /* ..\node_modules\.pnpm\svelte-simple-datatables@0.2.3\node_modules\svelte-simple-datatables\src\Datatable.svelte generated by Svelte v3.52.0 */
    const file$2 = "..\\node_modules\\.pnpm\\svelte-simple-datatables@0.2.3\\node_modules\\svelte-simple-datatables\\src\\Datatable.svelte";
    const get_default_slot_changes = dirty => ({});
    const get_default_slot_context = ctx => ({ rows: /*datatable*/ ctx[3].getRows() });

    // (40:1) {#if $options.blocks.searchInput === true}
    function create_if_block_2$1(ctx) {
    	let search;
    	let current;

    	search = new Search({
    			props: {
    				options: /*options*/ ctx[4],
    				id: /*id*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(search.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(search, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const search_changes = {};
    			if (dirty & /*id*/ 2) search_changes.id = /*id*/ ctx[1];
    			search.$set(search_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(search, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(40:1) {#if $options.blocks.searchInput === true}",
    		ctx
    	});

    	return block;
    }

    // (44:2) {#if $options.scrollY}
    function create_if_block_1$1(ctx) {
    	let stickyheader;
    	let current;

    	stickyheader = new StickyHeader({
    			props: {
    				id: /*id*/ ctx[1],
    				options: /*options*/ ctx[4],
    				columns: /*datatable*/ ctx[3].getColumns()
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stickyheader.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stickyheader, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stickyheader_changes = {};
    			if (dirty & /*id*/ 2) stickyheader_changes.id = /*id*/ ctx[1];
    			stickyheader.$set(stickyheader_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stickyheader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stickyheader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stickyheader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(44:2) {#if $options.scrollY}",
    		ctx
    	});

    	return block;
    }

    // (51:1) {#if $options.blocks.paginationRowCount === true || $options.blocks.paginationButtons === true}
    function create_if_block$2(ctx) {
    	let pagination;
    	let current;

    	pagination = new Pagination({
    			props: {
    				options: /*options*/ ctx[4],
    				id: /*id*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pagination.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pagination, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pagination_changes = {};
    			if (dirty & /*id*/ 2) pagination_changes.id = /*id*/ ctx[1];
    			pagination.$set(pagination_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pagination, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(51:1) {#if $options.blocks.paginationRowCount === true || $options.blocks.paginationButtons === true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let t0;
    	let article;
    	let t1;
    	let table;
    	let t2;
    	let section_class_value;
    	let current;
    	let if_block0 = /*$options*/ ctx[2].blocks.searchInput === true && create_if_block_2$1(ctx);
    	let if_block1 = /*$options*/ ctx[2].scrollY && create_if_block_1$1(ctx);
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context);
    	let if_block2 = (/*$options*/ ctx[2].blocks.paginationRowCount === true || /*$options*/ ctx[2].blocks.paginationButtons === true) && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			article = element("article");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			table = element("table");
    			if (default_slot) default_slot.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(table, "class", "svelte-z0nhq");
    			add_location(table, file$2, 46, 2, 1193);
    			attr_dev(article, "class", "dt-table svelte-z0nhq");
    			add_location(article, file$2, 42, 1, 1060);
    			attr_dev(section, "id", /*id*/ ctx[1]);
    			attr_dev(section, "class", section_class_value = "datatable " + /*classList*/ ctx[0] + " svelte-z0nhq");
    			toggle_class(section, "scroll-y", /*$options*/ ctx[2].scrollY);
    			toggle_class(section, "css", /*$options*/ ctx[2].css);
    			add_location(section, file$2, 33, 0, 860);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			if (if_block0) if_block0.m(section, null);
    			append_dev(section, t0);
    			append_dev(section, article);
    			if (if_block1) if_block1.m(article, null);
    			append_dev(article, t1);
    			append_dev(article, table);

    			if (default_slot) {
    				default_slot.m(table, null);
    			}

    			append_dev(section, t2);
    			if (if_block2) if_block2.m(section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$options*/ ctx[2].blocks.searchInput === true) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$options*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(section, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$options*/ ctx[2].scrollY) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$options*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(article, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (/*$options*/ ctx[2].blocks.paginationRowCount === true || /*$options*/ ctx[2].blocks.paginationButtons === true) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*$options*/ 4) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$2(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(section, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*id*/ 2) {
    				attr_dev(section, "id", /*id*/ ctx[1]);
    			}

    			if (!current || dirty & /*classList*/ 1 && section_class_value !== (section_class_value = "datatable " + /*classList*/ ctx[0] + " svelte-z0nhq")) {
    				attr_dev(section, "class", section_class_value);
    			}

    			if (!current || dirty & /*classList, $options*/ 5) {
    				toggle_class(section, "scroll-y", /*$options*/ ctx[2].scrollY);
    			}

    			if (!current || dirty & /*classList, $options*/ 5) {
    				toggle_class(section, "css", /*$options*/ ctx[2].css);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(default_slot, local);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(default_slot, local);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (default_slot) default_slot.d(detaching);
    			if (if_block2) if_block2.d();
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
    	let $options;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Datatable', slots, ['default']);
    	let { data = [] } = $$props;
    	let { settings = {} } = $$props;
    	let { classList = '' } = $$props;
    	let { id = 'svelte-simple-datatable' } = $$props;

    	//Initialize context for all stores.
    	const datatable = new Datatable(id);

    	datatable.create();
    	const options = datatable.getOptions();
    	validate_store(options, 'options');
    	component_subscribe($$self, options, value => $$invalidate(2, $options = value));
    	const component = new Component(id);
    	const rows = datatable.getRows();
    	const dataRows = rows;
    	onMount(() => component.init());
    	onDestroy(() => component.reset());
    	const writable_props = ['data', 'settings', 'classList', 'id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Datatable> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(5, data = $$props.data);
    		if ('settings' in $$props) $$invalidate(6, settings = $$props.settings);
    		if ('classList' in $$props) $$invalidate(0, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Search,
    		Pagination,
    		StickyHeader,
    		onMount,
    		onDestroy,
    		Datatable,
    		Component,
    		data,
    		settings,
    		classList,
    		id,
    		datatable,
    		options,
    		component,
    		rows,
    		dataRows,
    		$options
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(5, data = $$props.data);
    		if ('settings' in $$props) $$invalidate(6, settings = $$props.settings);
    		if ('classList' in $$props) $$invalidate(0, classList = $$props.classList);
    		if ('id' in $$props) $$invalidate(1, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data, settings*/ 96) {
    			{
    				component.setRows(data);
    				options.set(options.parse(settings));
    			}
    		}
    	};

    	return [
    		classList,
    		id,
    		$options,
    		datatable,
    		options,
    		data,
    		settings,
    		dataRows,
    		$$scope,
    		slots
    	];
    }

    class Datatable_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			data: 5,
    			settings: 6,
    			classList: 0,
    			id: 1,
    			dataRows: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Datatable_1",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get data() {
    		throw new Error("<Datatable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Datatable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get settings() {
    		throw new Error("<Datatable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set settings(value) {
    		throw new Error("<Datatable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classList() {
    		throw new Error("<Datatable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classList(value) {
    		throw new Error("<Datatable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Datatable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Datatable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRows() {
    		return this.$$.ctx[7];
    	}

    	set dataRows(value) {
    		throw new Error("<Datatable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\EssayTable.svelte generated by Svelte v3.52.0 */
    const file$1 = "src\\components\\EssayTable.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (35:6) {#if rows}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*$rows*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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
    			if (dirty & /*$rows*/ 4) {
    				each_value = /*$rows*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(35:6) {#if rows}",
    		ctx
    	});

    	return block;
    }

    // (36:8) {#each $rows as row}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*row*/ ctx[11].author + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*row*/ ctx[11].title + "";
    	let t2;
    	let t3;
    	let td2;
    	let t4_value = /*row*/ ctx[11].tutors?.map(func).join(", ") + "";
    	let t4;
    	let t5;
    	let td3;
    	let t6_value = /*row*/ ctx[11].programme?.name + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*row*/ ctx[11].categories?.map(func_1).join(", ") + "";
    	let t8;
    	let t9;
    	let td5;
    	let t10_value = /*row*/ ctx[11].topics?.map(func_2).join(", ") + "";
    	let t10;
    	let t11;
    	let td6;
    	let t12_value = /*row*/ ctx[11].client?.name + "";
    	let t12;
    	let t13;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			t4 = text(t4_value);
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			t10 = text(t10_value);
    			t11 = space();
    			td6 = element("td");
    			t12 = text(t12_value);
    			t13 = space();
    			add_location(td0, file$1, 37, 12, 1072);
    			add_location(td1, file$1, 38, 12, 1107);
    			add_location(td2, file$1, 39, 12, 1141);
    			add_location(td3, file$1, 40, 12, 1211);
    			add_location(td4, file$1, 41, 12, 1255);
    			add_location(td5, file$1, 42, 12, 1325);
    			add_location(td6, file$1, 43, 12, 1391);
    			add_location(tr, file$1, 36, 10, 1054);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, t4);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, t10);
    			append_dev(tr, t11);
    			append_dev(tr, td6);
    			append_dev(td6, t12);
    			append_dev(tr, t13);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$rows*/ 4 && t0_value !== (t0_value = /*row*/ ctx[11].author + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*$rows*/ 4 && t2_value !== (t2_value = /*row*/ ctx[11].title + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$rows*/ 4 && t4_value !== (t4_value = /*row*/ ctx[11].tutors?.map(func).join(", ") + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*$rows*/ 4 && t6_value !== (t6_value = /*row*/ ctx[11].programme?.name + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*$rows*/ 4 && t8_value !== (t8_value = /*row*/ ctx[11].categories?.map(func_1).join(", ") + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*$rows*/ 4 && t10_value !== (t10_value = /*row*/ ctx[11].topics?.map(func_2).join(", ") + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*$rows*/ 4 && t12_value !== (t12_value = /*row*/ ctx[11].client?.name + "")) set_data_dev(t12, t12_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(36:8) {#each $rows as row}",
    		ctx
    	});

    	return block;
    }

    // (24:2) <Datatable {settings} data={essays} bind:dataRows={rows}>
    function create_default_slot(ctx) {
    	let thead;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let th6;
    	let t13;
    	let tbody;
    	let if_block = /*rows*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			th0 = element("th");
    			th0.textContent = "Author";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Title";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Supervisors";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Programme";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Categories";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Topics";
    			t11 = space();
    			th6 = element("th");
    			th6.textContent = "Client";
    			t13 = space();
    			tbody = element("tbody");
    			if (if_block) if_block.c();
    			attr_dev(th0, "data-key", "author");
    			add_location(th0, file$1, 25, 6, 693);
    			attr_dev(th1, "data-key", "title");
    			add_location(th1, file$1, 26, 6, 734);
    			add_location(th2, file$1, 27, 6, 773);
    			attr_dev(th3, "data-key", "(row) => row.programme.name");
    			add_location(th3, file$1, 28, 6, 801);
    			add_location(th4, file$1, 29, 6, 866);
    			add_location(th5, file$1, 30, 6, 893);
    			attr_dev(th6, "data-key", "(row) => row.client.name");
    			add_location(th6, file$1, 31, 6, 916);
    			add_location(thead, file$1, 24, 4, 678);
    			add_location(tbody, file$1, 33, 4, 987);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, th0);
    			append_dev(thead, t1);
    			append_dev(thead, th1);
    			append_dev(thead, t3);
    			append_dev(thead, th2);
    			append_dev(thead, t5);
    			append_dev(thead, th3);
    			append_dev(thead, t7);
    			append_dev(thead, th4);
    			append_dev(thead, t9);
    			append_dev(thead, th5);
    			append_dev(thead, t11);
    			append_dev(thead, th6);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, tbody, anchor);
    			if (if_block) if_block.m(tbody, null);
    		},
    		p: function update(ctx, dirty) {
    			if (/*rows*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(tbody, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(tbody);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(24:2) <Datatable {settings} data={essays} bind:dataRows={rows}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let datatable;
    	let updating_dataRows;
    	let current;

    	function datatable_dataRows_binding(value) {
    		/*datatable_dataRows_binding*/ ctx[9](value);
    	}

    	let datatable_props = {
    		settings: /*settings*/ ctx[3],
    		data: /*essays*/ ctx[0],
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*rows*/ ctx[1] !== void 0) {
    		datatable_props.dataRows = /*rows*/ ctx[1];
    	}

    	datatable = new Datatable_1({ props: datatable_props, $$inline: true });
    	binding_callbacks.push(() => bind(datatable, 'dataRows', datatable_dataRows_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(datatable.$$.fragment);
    			attr_dev(div, "id", "essay-table");
    			attr_dev(div, "class", "svelte-9d7mnz");
    			add_location(div, file$1, 22, 0, 589);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(datatable, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const datatable_changes = {};
    			if (dirty & /*essays*/ 1) datatable_changes.data = /*essays*/ ctx[0];

    			if (dirty & /*$$scope, $rows, rows*/ 16390) {
    				datatable_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_dataRows && dirty & /*rows*/ 2) {
    				updating_dataRows = true;
    				datatable_changes.dataRows = /*rows*/ ctx[1];
    				add_flush_callback(() => updating_dataRows = false);
    			}

    			datatable.$set(datatable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(datatable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(datatable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(datatable);
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

    const func = t => t.names[0];
    const func_1 = c => c.name;
    const func_2 = t => t.name;

    function instance$1($$self, $$props, $$invalidate) {
    	let $rows,
    		$$unsubscribe_rows = noop,
    		$$subscribe_rows = () => ($$unsubscribe_rows(), $$unsubscribe_rows = subscribe(rows, $$value => $$invalidate(2, $rows = $$value)), rows);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_rows());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EssayTable', slots, []);
    	let { programme } = $$props;
    	let { categories } = $$props;
    	let { client } = $$props;
    	let { tutors } = $$props;
    	let { topics } = $$props;

    	const settings = {
    		sortable: true,
    		pagination: true,
    		rowsPerPage: 25
    	};

    	let essays = [];
    	let rows;

    	async function updateEssays(programme, categories, client, tutors, topics) {
    		$$invalidate(0, essays = await getEssays(programme, categories, topics, tutors, client));
    	}

    	$$self.$$.on_mount.push(function () {
    		if (programme === undefined && !('programme' in $$props || $$self.$$.bound[$$self.$$.props['programme']])) {
    			console.warn("<EssayTable> was created without expected prop 'programme'");
    		}

    		if (categories === undefined && !('categories' in $$props || $$self.$$.bound[$$self.$$.props['categories']])) {
    			console.warn("<EssayTable> was created without expected prop 'categories'");
    		}

    		if (client === undefined && !('client' in $$props || $$self.$$.bound[$$self.$$.props['client']])) {
    			console.warn("<EssayTable> was created without expected prop 'client'");
    		}

    		if (tutors === undefined && !('tutors' in $$props || $$self.$$.bound[$$self.$$.props['tutors']])) {
    			console.warn("<EssayTable> was created without expected prop 'tutors'");
    		}

    		if (topics === undefined && !('topics' in $$props || $$self.$$.bound[$$self.$$.props['topics']])) {
    			console.warn("<EssayTable> was created without expected prop 'topics'");
    		}
    	});

    	const writable_props = ['programme', 'categories', 'client', 'tutors', 'topics'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EssayTable> was created with unknown prop '${key}'`);
    	});

    	function datatable_dataRows_binding(value) {
    		rows = value;
    		$$subscribe_rows($$invalidate(1, rows));
    	}

    	$$self.$$set = $$props => {
    		if ('programme' in $$props) $$invalidate(4, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(5, categories = $$props.categories);
    		if ('client' in $$props) $$invalidate(6, client = $$props.client);
    		if ('tutors' in $$props) $$invalidate(7, tutors = $$props.tutors);
    		if ('topics' in $$props) $$invalidate(8, topics = $$props.topics);
    	};

    	$$self.$capture_state = () => ({
    		getEssays,
    		Datatable: Datatable_1,
    		programme,
    		categories,
    		client,
    		tutors,
    		topics,
    		settings,
    		essays,
    		rows,
    		updateEssays,
    		$rows
    	});

    	$$self.$inject_state = $$props => {
    		if ('programme' in $$props) $$invalidate(4, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(5, categories = $$props.categories);
    		if ('client' in $$props) $$invalidate(6, client = $$props.client);
    		if ('tutors' in $$props) $$invalidate(7, tutors = $$props.tutors);
    		if ('topics' in $$props) $$invalidate(8, topics = $$props.topics);
    		if ('essays' in $$props) $$invalidate(0, essays = $$props.essays);
    		if ('rows' in $$props) $$subscribe_rows($$invalidate(1, rows = $$props.rows));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*programme, categories, client, tutors, topics*/ 496) {
    			{
    				updateEssays(programme, categories, client, tutors, topics);
    			}
    		}
    	};

    	return [
    		essays,
    		rows,
    		$rows,
    		settings,
    		programme,
    		categories,
    		client,
    		tutors,
    		topics,
    		datatable_dataRows_binding
    	];
    }

    class EssayTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			programme: 4,
    			categories: 5,
    			client: 6,
    			tutors: 7,
    			topics: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EssayTable",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get programme() {
    		throw new Error("<EssayTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set programme(value) {
    		throw new Error("<EssayTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get categories() {
    		throw new Error("<EssayTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set categories(value) {
    		throw new Error("<EssayTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get client() {
    		throw new Error("<EssayTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set client(value) {
    		throw new Error("<EssayTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tutors() {
    		throw new Error("<EssayTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tutors(value) {
    		throw new Error("<EssayTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get topics() {
    		throw new Error("<EssayTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topics(value) {
    		throw new Error("<EssayTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.52.0 */
    const file = "src\\App.svelte";

    // (28:6) {#if goal}
    function create_if_block(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let if_block5_anchor;
    	let current;
    	let if_block0 = /*goal*/ ctx[2] !== "supervisor" && create_if_block_6(ctx);
    	let if_block1 = /*goal*/ ctx[2] !== "topic" && create_if_block_5(ctx);
    	let if_block2 = /*goal*/ ctx[2] !== "client" && create_if_block_4(ctx);
    	let if_block3 = /*goal*/ ctx[2] === "supervisor" && create_if_block_3(ctx);
    	let if_block4 = /*goal*/ ctx[2] === "topic" && create_if_block_2(ctx);
    	let if_block5 = /*goal*/ ctx[2] === "client" && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			if_block5_anchor = empty();
    			attr_dev(div, "id", "additional-filters");
    			attr_dev(div, "class", "row svelte-14sctgs");
    			add_location(div, file, 28, 8, 1090);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			insert_dev(target, t2, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block4) if_block4.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block5) if_block5.m(target, anchor);
    			insert_dev(target, if_block5_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*goal*/ ctx[2] !== "supervisor") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*goal*/ 4) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*goal*/ ctx[2] !== "topic") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*goal*/ 4) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_5(ctx);
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

    			if (/*goal*/ ctx[2] !== "client") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*goal*/ 4) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_4(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*goal*/ ctx[2] === "supervisor") {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*goal*/ 4) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_3(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(t3.parentNode, t3);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*goal*/ ctx[2] === "topic") {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty & /*goal*/ 4) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_2(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(t4.parentNode, t4);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*goal*/ ctx[2] === "client") {
    				if (if_block5) ; else {
    					if_block5 = create_if_block_1(ctx);
    					if_block5.c();
    					if_block5.m(if_block5_anchor.parentNode, if_block5_anchor);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (detaching) detach_dev(t2);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block4) if_block4.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (if_block5) if_block5.d(detaching);
    			if (detaching) detach_dev(if_block5_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(28:6) {#if goal}",
    		ctx
    	});

    	return block;
    }

    // (30:10) {#if goal !== "supervisor"}
    function create_if_block_6(ctx) {
    	let selectsupervisor;
    	let updating_tutors;
    	let current;

    	function selectsupervisor_tutors_binding(value) {
    		/*selectsupervisor_tutors_binding*/ ctx[10](value);
    	}

    	let selectsupervisor_props = {
    		categories: /*categories*/ ctx[1],
    		programme: /*programme*/ ctx[0],
    		topics: /*topics*/ ctx[4],
    		client: /*client*/ ctx[5]
    	};

    	if (/*tutors*/ ctx[3] !== void 0) {
    		selectsupervisor_props.tutors = /*tutors*/ ctx[3];
    	}

    	selectsupervisor = new SelectSupervisor({
    			props: selectsupervisor_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(selectsupervisor, 'tutors', selectsupervisor_tutors_binding));

    	const block = {
    		c: function create() {
    			create_component(selectsupervisor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(selectsupervisor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const selectsupervisor_changes = {};
    			if (dirty & /*categories*/ 2) selectsupervisor_changes.categories = /*categories*/ ctx[1];
    			if (dirty & /*programme*/ 1) selectsupervisor_changes.programme = /*programme*/ ctx[0];
    			if (dirty & /*topics*/ 16) selectsupervisor_changes.topics = /*topics*/ ctx[4];
    			if (dirty & /*client*/ 32) selectsupervisor_changes.client = /*client*/ ctx[5];

    			if (!updating_tutors && dirty & /*tutors*/ 8) {
    				updating_tutors = true;
    				selectsupervisor_changes.tutors = /*tutors*/ ctx[3];
    				add_flush_callback(() => updating_tutors = false);
    			}

    			selectsupervisor.$set(selectsupervisor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectsupervisor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectsupervisor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(selectsupervisor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(30:10) {#if goal !== \\\"supervisor\\\"}",
    		ctx
    	});

    	return block;
    }

    // (39:10) {#if goal !== "topic"}
    function create_if_block_5(ctx) {
    	let selecttopic;
    	let updating_topics;
    	let current;

    	function selecttopic_topics_binding(value) {
    		/*selecttopic_topics_binding*/ ctx[11](value);
    	}

    	let selecttopic_props = {
    		categories: /*categories*/ ctx[1],
    		programme: /*programme*/ ctx[0],
    		tutors: /*tutors*/ ctx[3],
    		client: /*client*/ ctx[5]
    	};

    	if (/*topics*/ ctx[4] !== void 0) {
    		selecttopic_props.topics = /*topics*/ ctx[4];
    	}

    	selecttopic = new SelectTopic({ props: selecttopic_props, $$inline: true });
    	binding_callbacks.push(() => bind(selecttopic, 'topics', selecttopic_topics_binding));

    	const block = {
    		c: function create() {
    			create_component(selecttopic.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(selecttopic, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const selecttopic_changes = {};
    			if (dirty & /*categories*/ 2) selecttopic_changes.categories = /*categories*/ ctx[1];
    			if (dirty & /*programme*/ 1) selecttopic_changes.programme = /*programme*/ ctx[0];
    			if (dirty & /*tutors*/ 8) selecttopic_changes.tutors = /*tutors*/ ctx[3];
    			if (dirty & /*client*/ 32) selecttopic_changes.client = /*client*/ ctx[5];

    			if (!updating_topics && dirty & /*topics*/ 16) {
    				updating_topics = true;
    				selecttopic_changes.topics = /*topics*/ ctx[4];
    				add_flush_callback(() => updating_topics = false);
    			}

    			selecttopic.$set(selecttopic_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selecttopic.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selecttopic.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(selecttopic, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(39:10) {#if goal !== \\\"topic\\\"}",
    		ctx
    	});

    	return block;
    }

    // (48:10) {#if goal !== "client"}
    function create_if_block_4(ctx) {
    	let selectclient;
    	let updating_client;
    	let current;

    	function selectclient_client_binding(value) {
    		/*selectclient_client_binding*/ ctx[12](value);
    	}

    	let selectclient_props = {
    		categories: /*categories*/ ctx[1],
    		programme: /*programme*/ ctx[0],
    		tutors: /*tutors*/ ctx[3],
    		topics: /*topics*/ ctx[4]
    	};

    	if (/*client*/ ctx[5] !== void 0) {
    		selectclient_props.client = /*client*/ ctx[5];
    	}

    	selectclient = new SelectClient({
    			props: selectclient_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(selectclient, 'client', selectclient_client_binding));

    	const block = {
    		c: function create() {
    			create_component(selectclient.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(selectclient, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const selectclient_changes = {};
    			if (dirty & /*categories*/ 2) selectclient_changes.categories = /*categories*/ ctx[1];
    			if (dirty & /*programme*/ 1) selectclient_changes.programme = /*programme*/ ctx[0];
    			if (dirty & /*tutors*/ 8) selectclient_changes.tutors = /*tutors*/ ctx[3];
    			if (dirty & /*topics*/ 16) selectclient_changes.topics = /*topics*/ ctx[4];

    			if (!updating_client && dirty & /*client*/ 32) {
    				updating_client = true;
    				selectclient_changes.client = /*client*/ ctx[5];
    				add_flush_callback(() => updating_client = false);
    			}

    			selectclient.$set(selectclient_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectclient.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectclient.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(selectclient, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(48:10) {#if goal !== \\\"client\\\"}",
    		ctx
    	});

    	return block;
    }

    // (58:8) {#if goal === "supervisor"}
    function create_if_block_3(ctx) {
    	let exploresupervisors;
    	let current;

    	exploresupervisors = new ExploreSupervisors({
    			props: {
    				categories: /*categories*/ ctx[1],
    				programme: /*programme*/ ctx[0],
    				client: /*client*/ ctx[5],
    				topics: /*topics*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(exploresupervisors.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(exploresupervisors, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const exploresupervisors_changes = {};
    			if (dirty & /*categories*/ 2) exploresupervisors_changes.categories = /*categories*/ ctx[1];
    			if (dirty & /*programme*/ 1) exploresupervisors_changes.programme = /*programme*/ ctx[0];
    			if (dirty & /*client*/ 32) exploresupervisors_changes.client = /*client*/ ctx[5];
    			if (dirty & /*topics*/ 16) exploresupervisors_changes.topics = /*topics*/ ctx[4];
    			exploresupervisors.$set(exploresupervisors_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(exploresupervisors.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(exploresupervisors.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(exploresupervisors, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(58:8) {#if goal === \\\"supervisor\\\"}",
    		ctx
    	});

    	return block;
    }

    // (61:8) {#if goal === "topic"}
    function create_if_block_2(ctx) {
    	let exploretopics;
    	let current;

    	exploretopics = new ExploreTopics({
    			props: {
    				categories: /*categories*/ ctx[1],
    				programme: /*programme*/ ctx[0],
    				supervisors: /*tutors*/ ctx[3],
    				client: /*client*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(exploretopics.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(exploretopics, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const exploretopics_changes = {};
    			if (dirty & /*categories*/ 2) exploretopics_changes.categories = /*categories*/ ctx[1];
    			if (dirty & /*programme*/ 1) exploretopics_changes.programme = /*programme*/ ctx[0];
    			if (dirty & /*tutors*/ 8) exploretopics_changes.supervisors = /*tutors*/ ctx[3];
    			if (dirty & /*client*/ 32) exploretopics_changes.client = /*client*/ ctx[5];
    			exploretopics.$set(exploretopics_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(exploretopics.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(exploretopics.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(exploretopics, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(61:8) {#if goal === \\\"topic\\\"}",
    		ctx
    	});

    	return block;
    }

    // (69:8) {#if goal === "client"}
    function create_if_block_1(ctx) {
    	const block = { c: noop, m: noop, d: noop };

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(69:8) {#if goal === \\\"client\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div;
    	let h1;
    	let t1;
    	let form;
    	let selectprogramme;
    	let updating_programme;
    	let t2;
    	let selectcategories;
    	let updating_categories;
    	let t3;
    	let choosegoal;
    	let updating_goal;
    	let t4;
    	let t5;
    	let h20;
    	let t7;
    	let code;
    	let pre;

    	let t8_value = JSON.stringify(
    		{
    			programme: /*programme*/ ctx[0],
    			categories: /*categories*/ ctx[1],
    			goal: /*goal*/ ctx[2],
    			tutors: /*tutors*/ ctx[3],
    			client: /*client*/ ctx[5],
    			topics: /*topics*/ ctx[4]
    		},
    		null,
    		2
    	) + "";

    	let t8;
    	let t9;
    	let h21;
    	let t11;
    	let essaytable;
    	let current;
    	let mounted;
    	let dispose;

    	function selectprogramme_programme_binding(value) {
    		/*selectprogramme_programme_binding*/ ctx[7](value);
    	}

    	let selectprogramme_props = {};

    	if (/*programme*/ ctx[0] !== void 0) {
    		selectprogramme_props.programme = /*programme*/ ctx[0];
    	}

    	selectprogramme = new SelectProgramme({
    			props: selectprogramme_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(selectprogramme, 'programme', selectprogramme_programme_binding));

    	function selectcategories_categories_binding(value) {
    		/*selectcategories_categories_binding*/ ctx[8](value);
    	}

    	let selectcategories_props = { programme: /*programme*/ ctx[0] };

    	if (/*categories*/ ctx[1] !== void 0) {
    		selectcategories_props.categories = /*categories*/ ctx[1];
    	}

    	selectcategories = new SelectCategories({
    			props: selectcategories_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(selectcategories, 'categories', selectcategories_categories_binding));

    	function choosegoal_goal_binding(value) {
    		/*choosegoal_goal_binding*/ ctx[9](value);
    	}

    	let choosegoal_props = {
    		enabled: /*programme*/ ctx[0] && /*categories*/ ctx[1] && /*categories*/ ctx[1].length > 0
    	};

    	if (/*goal*/ ctx[2] !== void 0) {
    		choosegoal_props.goal = /*goal*/ ctx[2];
    	}

    	choosegoal = new ChooseGoal({ props: choosegoal_props, $$inline: true });
    	binding_callbacks.push(() => bind(choosegoal, 'goal', choosegoal_goal_binding));
    	let if_block = /*goal*/ ctx[2] && create_if_block(ctx);

    	essaytable = new EssayTable({
    			props: {
    				categories: /*categories*/ ctx[1],
    				programme: /*programme*/ ctx[0],
    				client: /*client*/ ctx[5],
    				topics: /*topics*/ ctx[4],
    				tutors: /*tutors*/ ctx[3]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Steers";
    			t1 = space();
    			form = element("form");
    			create_component(selectprogramme.$$.fragment);
    			t2 = space();
    			create_component(selectcategories.$$.fragment);
    			t3 = space();
    			create_component(choosegoal.$$.fragment);
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			h20 = element("h2");
    			h20.textContent = "Query";
    			t7 = space();
    			code = element("code");
    			pre = element("pre");
    			t8 = text(t8_value);
    			t9 = space();
    			h21 = element("h2");
    			h21.textContent = "Essays";
    			t11 = space();
    			create_component(essaytable.$$.fragment);
    			attr_dev(h1, "class", "svelte-14sctgs");
    			add_location(h1, file, 19, 4, 773);
    			add_location(h20, file, 72, 6, 2302);
    			add_location(pre, file, 74, 8, 2366);
    			set_style(code, "text-align", "left");
    			add_location(code, file, 73, 6, 2324);
    			add_location(h21, file, 76, 6, 2483);
    			attr_dev(form, "action", "");
    			attr_dev(form, "class", "form");
    			add_location(form, file, 20, 4, 794);
    			attr_dev(div, "class", "container");
    			add_location(div, file, 18, 2, 744);
    			attr_dev(main, "class", "svelte-14sctgs");
    			add_location(main, file, 17, 0, 734);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, form);
    			mount_component(selectprogramme, form, null);
    			append_dev(form, t2);
    			mount_component(selectcategories, form, null);
    			append_dev(form, t3);
    			mount_component(choosegoal, form, null);
    			append_dev(form, t4);
    			if (if_block) if_block.m(form, null);
    			append_dev(form, t5);
    			append_dev(form, h20);
    			append_dev(form, t7);
    			append_dev(form, code);
    			append_dev(code, pre);
    			append_dev(pre, t8);
    			append_dev(form, t9);
    			append_dev(form, h21);
    			append_dev(form, t11);
    			mount_component(essaytable, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[6]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const selectprogramme_changes = {};

    			if (!updating_programme && dirty & /*programme*/ 1) {
    				updating_programme = true;
    				selectprogramme_changes.programme = /*programme*/ ctx[0];
    				add_flush_callback(() => updating_programme = false);
    			}

    			selectprogramme.$set(selectprogramme_changes);
    			const selectcategories_changes = {};
    			if (dirty & /*programme*/ 1) selectcategories_changes.programme = /*programme*/ ctx[0];

    			if (!updating_categories && dirty & /*categories*/ 2) {
    				updating_categories = true;
    				selectcategories_changes.categories = /*categories*/ ctx[1];
    				add_flush_callback(() => updating_categories = false);
    			}

    			selectcategories.$set(selectcategories_changes);
    			const choosegoal_changes = {};
    			if (dirty & /*programme, categories*/ 3) choosegoal_changes.enabled = /*programme*/ ctx[0] && /*categories*/ ctx[1] && /*categories*/ ctx[1].length > 0;

    			if (!updating_goal && dirty & /*goal*/ 4) {
    				updating_goal = true;
    				choosegoal_changes.goal = /*goal*/ ctx[2];
    				add_flush_callback(() => updating_goal = false);
    			}

    			choosegoal.$set(choosegoal_changes);

    			if (/*goal*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*goal*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(form, t5);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*programme, categories, goal, tutors, client, topics*/ 63) && t8_value !== (t8_value = JSON.stringify(
    				{
    					programme: /*programme*/ ctx[0],
    					categories: /*categories*/ ctx[1],
    					goal: /*goal*/ ctx[2],
    					tutors: /*tutors*/ ctx[3],
    					client: /*client*/ ctx[5],
    					topics: /*topics*/ ctx[4]
    				},
    				null,
    				2
    			) + "")) set_data_dev(t8, t8_value);

    			const essaytable_changes = {};
    			if (dirty & /*categories*/ 2) essaytable_changes.categories = /*categories*/ ctx[1];
    			if (dirty & /*programme*/ 1) essaytable_changes.programme = /*programme*/ ctx[0];
    			if (dirty & /*client*/ 32) essaytable_changes.client = /*client*/ ctx[5];
    			if (dirty & /*topics*/ 16) essaytable_changes.topics = /*topics*/ ctx[4];
    			if (dirty & /*tutors*/ 8) essaytable_changes.tutors = /*tutors*/ ctx[3];
    			essaytable.$set(essaytable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(selectprogramme.$$.fragment, local);
    			transition_in(selectcategories.$$.fragment, local);
    			transition_in(choosegoal.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(essaytable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(selectprogramme.$$.fragment, local);
    			transition_out(selectcategories.$$.fragment, local);
    			transition_out(choosegoal.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(essaytable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(selectprogramme);
    			destroy_component(selectcategories);
    			destroy_component(choosegoal);
    			if (if_block) if_block.d();
    			destroy_component(essaytable);
    			mounted = false;
    			dispose();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let programme = null;
    	let categories = [];
    	let goal = null;
    	let tutors = [];
    	let topics = [];
    	let client = null;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function submit_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function selectprogramme_programme_binding(value) {
    		programme = value;
    		$$invalidate(0, programme);
    	}

    	function selectcategories_categories_binding(value) {
    		categories = value;
    		$$invalidate(1, categories);
    	}

    	function choosegoal_goal_binding(value) {
    		goal = value;
    		$$invalidate(2, goal);
    	}

    	function selectsupervisor_tutors_binding(value) {
    		tutors = value;
    		$$invalidate(3, tutors);
    	}

    	function selecttopic_topics_binding(value) {
    		topics = value;
    		$$invalidate(4, topics);
    	}

    	function selectclient_client_binding(value) {
    		client = value;
    		$$invalidate(5, client);
    	}

    	$$self.$capture_state = () => ({
    		ChooseGoal,
    		SelectCategories,
    		SelectClient,
    		SelectProgramme,
    		SelectSupervisor,
    		SelectTopic,
    		ExploreSupervisors,
    		ExploreTopics,
    		EssayTable,
    		programme,
    		categories,
    		goal,
    		tutors,
    		topics,
    		client
    	});

    	$$self.$inject_state = $$props => {
    		if ('programme' in $$props) $$invalidate(0, programme = $$props.programme);
    		if ('categories' in $$props) $$invalidate(1, categories = $$props.categories);
    		if ('goal' in $$props) $$invalidate(2, goal = $$props.goal);
    		if ('tutors' in $$props) $$invalidate(3, tutors = $$props.tutors);
    		if ('topics' in $$props) $$invalidate(4, topics = $$props.topics);
    		if ('client' in $$props) $$invalidate(5, client = $$props.client);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		programme,
    		categories,
    		goal,
    		tutors,
    		topics,
    		client,
    		submit_handler,
    		selectprogramme_programme_binding,
    		selectcategories_categories_binding,
    		choosegoal_goal_binding,
    		selectsupervisor_tutors_binding,
    		selecttopic_topics_binding,
    		selectclient_client_binding
    	];
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
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
