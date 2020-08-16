/*<template>
  <div id="app">
    <div class="head">
      <div class="input">
        <b class="label">Width</b>
        <span><input type="number" v-model="width" /> frames</span>
      </div>
      <div class="input">
        <b class="label">Height</b>
        <span><input type="number" v-model="height" /> frames</span>
      </div>
      <div>
        <b class="label">ZOOM</b>
        <select v-model.number="zoom">
          <option value="0.5">x0.5</option>
          <option value="1">x1</option>
          <option value="2">x2</option>
          <option value="4">x4</option>
        </select>
      </div>

      <div class="btn import" @click="triggerImportSelector()">
        <span class="material-icons">cloud_upload</span>
        <span class="text">Import</span>
      </div>
      <div class="btn export" @click="exportSavepoint()">
        <span class="material-icons">get_app</span>
        <span class="text">Export savepoint</span>
      </div>
      <div class="btn export">
        <span class="material-icons">get_app</span>
        <span class="text">Export for usage</span>
      </div>
    </div>
    <div class="row mainSpace">
      <div id="compTree">
        <component-list
          class="sidebar"
          root
          :components="elements"
          :value="selected ? selected.component : null"
          @input="
            comp => (selected = comp ? { component: comp, action: null } : null)
          "
          @copy="val => (copiedComponent = val)"
        ></component-list>

        <div class="btn" @click="ev => showCompAddMenu(ev)">
          <span class="material-icons">add</span>
          <span class="text">Add component</span>

          <div class="absoluteMenu" ref="compAddMenu">
            <template v-if="copiedComponent">
              <div class="entry" @click.stop="pasteComponent()">
                <span class="material-icons">content_paste</span>
                Paste
              </div>
              <div class="divider"></div>
            </template>
            <div
              v-for="(key, index) in Object.keys(componentInfo)"
              :key="index"
            >
              <div class="divider" v-if="index != 0"></div>
              <div class="entry" @click.stop="addNewCompoenent(key)">
                <span class="material-icons">{{
                  componentInfo[key].icon
                }}</span>
                {{ key }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="canvasContainer" @click.self="selected = null">
        <div id="canvasPadding" @click.self="selected = null">
          <my-canvas
            :width="width * 128"
            :height="height * 128"
            :selected="selected ? selected.component : null"
            :elements="elements"
            :zoom="zoom"
            :pauseRendering="pauseRendering"
            @select="
              comp =>
                (selected = comp ? { component: comp, action: null } : null)
            "
          ></my-canvas>
        </div>
      </div>
      <div class="sidebar" id="settings">
        <div id="generalSettings" v-if="selected">
          <div class="settings-box gen-box">
            <h1><span class="material-icons">tune</span> General settings</h1>
            <div class="settings-row">
              <span class="label">Name</span>
              <input type="text" v-model="selected.component.name" />
            </div>
            <div class="settings-row id-box">
              <span class="label">ID</span>
              <input
                type="text"
                :value="selected.component.id"
                @input="$refs.idInput.value = selected.component.id"
                ref="idInput"
              />
              <span class="material-icons" @click="copyID()" ref="copyIcon"
                >content_copy</span
              >
            </div>
            <div class="settings-row">
              <span class="label">Visibility</span>
              <input type="checkbox" />
            </div>
          </div>
          <div class="divider"></div>
          <div class="settings-box clickActions">
            <h1><span class="material-icons">touch_app</span> Click Action</h1>
            <component-list
              class="sidebar"
              root
              :components="selected.component.clickAction"
              v-model="selected.action"
              @copy="val => (copiedAction = val)"
            ></component-list>
            <div class="settings-row">
              <div class="btn addAction" @click="ev => showActionAddMenu(ev)">
                <span class="material-icons">add</span>
                <span class="text">Add action</span>

                <div class="absoluteMenu" ref="actionAddMenu">
                  <template v-if="copiedAction">
                    <div class="entry" @click.stop="pasteAction()">
                      <span class="material-icons">content_paste</span>
                      Paste
                    </div>
                    <div class="divider"></div>
                  </template>
                  <div
                    v-for="(key, index) in Object.keys(actions)"
                    :key="index"
                  >
                    <div class="divider" v-if="index != 0"></div>
                    <div class="entry" @click.stop="addNewAction(key)">
                      <span class="material-icons">{{
                        actions[key].icon
                      }}</span>
                      {{ key }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selected && selected.action" id="actionEditor">
              <h2>
                <span class="material-icons">edit</span> Edit
                {{ selected.action.id.toLowerCase() }}
              </h2>
              <component
                v-bind:is="actions[selected.action.id].component"
                :action="selected.action"
              ></component>
            </div>
          </div>
          <div class="divider"></div>
          <div class="settings-box">
            <h1>
              <span class="material-icons">{{ selected.component.icon }}</span>
              {{ selected.component.displayName }}
            </h1>
            <component
              v-bind:is="selected.component.vueComponent"
              :component="selected.component"
              :maxWidth="width * 128"
              :maxHeight="height * 128"
            ></component>
          </div>
        </div>
        <div v-else class="settings-box">
          <h1>
            <b class="label">no component selected</b>
          </h1>
        </div>
      </div>
    </div>
    <div ref="imageContainer" style="display:none"></div>
    <a ref="downloadAnchor" style="display:none"></a>
    <input
      type="file"
      ref="importFileSelect"
      accept=".json"
      style="display: none"
      @change="checkForUpload()"
    />
  </div>
</template>*/

/*<script lang="ts">*/
import ComponentList from "./components/ComponentList.vue";
import MyCanvas from "./components/Canvas.vue";
import Vue from "vue";
import { Component } from "./utils/Component";
import {
  componentInfo,
  componentFromJson,
  registerComponent,
  invisible,
  ExportData,
  unregisterComponent
} from "./utils/ComponentManager";
import { actions, actionFromJson } from "./utils/ActionManager";
import {
  setupImageManager,
  images,
  registerImageBase64
} from "./utils/ImageManager";
import { Action } from "./utils/Action";
import { fonts, registerFontBase64 } from "./utils/FontManager";
import { GroupComponent } from "./utils/components/GroupComponent";

export default Vue.extend({
  name: "App",
  components: { ComponentList, MyCanvas },

  data: () => {
    return {
      width: 3,
      height: 2,
      zoom: 2,

      selected: null as null | { component: Component; action: Action | null },

      componentInfo,
      actions,

      setupImageManager,

      copiedComponent: null as null | string,
      copiedAction: null as null | string,

      elements: [] as Component[],

      pauseRendering: false
    };
  },

  mounted() {
    document.addEventListener("click", this.checkClose, { capture: true });
    this.setupImageManager(this.$refs.imageContainer as HTMLElement);
  },

  destroyed() {
    document.removeEventListener("click", this.checkClose, { capture: true });
  },

  methods: {
    showActionAddMenu(ev: MouseEvent) {
      const menu = this.$refs.actionAddMenu as HTMLElement;
      menu.style.display = "block";
      setTimeout(() => {
        menu.style.top = ev.y + 10 + "px";
        menu.style.left = ev.x - menu.offsetWidth / 2 + "px";
      }, 10);
    },

    addNewAction(key: string) {
      if (this.selected) {
        const nAction = actions[key].generator(this.selected.component);
        this.selected.component.clickAction.push(nAction);
        this.selected.action = nAction;
      }
    },

    addNewCompoenent(key: string) {
      const nComp = componentInfo[key].generator();
      registerComponent(nComp);

      this.elements.splice(0, 0, nComp);
      this.selected = {
        component: nComp,
        action: null
      };
      const menu = this.$refs.compAddMenu as HTMLElement;
      menu.style.display = "none";
    },

    checkClose(ev: MouseEvent) {
      const menuComp = this.$refs.compAddMenu as HTMLElement;
      if (ev.target != menuComp) menuComp.style.display = "none";

      const menuAction = this.$refs.actionAddMenu as HTMLElement;
      if (menuAction && ev.target != menuAction)
        menuAction.style.display = "none";
    },

    showCompAddMenu(ev: MouseEvent) {
      const menu = this.$refs.compAddMenu as HTMLElement;
      menu.style.top = ev.y + "px";
      menu.style.left = ev.x + "px";
      menu.style.display = "block";
    },

    pasteAction() {
      if (this.selected && this.copiedAction) {
        const nAction = actionFromJson(JSON.parse(this.copiedAction));
        this.selected.component.clickAction.push(nAction);
        this.selected.action = nAction;
      }
    },

    pasteComponent() {
      if (this.copiedComponent) {
        const nComp = componentFromJson(
          JSON.parse(this.copiedComponent),
          true
        )!;
        this.elements.splice(0, 0, nComp);
        this.selected = {
          component: nComp,
          action: null
        };
      }
    },

    copyID() {
      const input = this.$refs.idInput as HTMLInputElement;
      const icon = this.$refs.copyIcon as HTMLElement;

      input.select();
      input.setSelectionRange(0, 99999);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.execCommand("copy");

      icon.innerText = "assignment_turned_in";

      setTimeout(() => (icon.innerText = "content_copy"), 1000);
    },

    exportSavepoint() {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(this.bundleToJson()));
      const dlAnchorElem = this.$refs.downloadAnchor as HTMLElement;
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", "AdvancedGUI.json");
      dlAnchorElem.click();
    },

    bundleToJson() {
      const compTree = new GroupComponent(
        "component_tree",
        "-",
        [],
        this.elements
      );
      const exportJsonObj: ExportData = {
        type: "savepoint",
        invisible: invisible,
        fonts: Object.values(fonts),
        width: this.width,
        height: this.height,
        images: Object.values(images).map(image => ({
          name: image.name,
          data: image.data.src
        })),
        componentTree: JSON.parse(compTree.toJson())
      };

      return exportJsonObj;
    },

    async loadFromJsonObj(jsonObj: ExportData, resetOld: boolean) {
      this.pauseRendering = true;
      if (jsonObj.type != "savepoint") {
        console.error("This .json file is not an AdvancedGUI savepoint!");
        return;
      }

      this.selected = null;
      this.copiedAction = null;
      this.copiedComponent = null;

      Object.assign(images, {});
      Object.assign(fonts, {});

      if (resetOld) {
        this.elements.forEach(elem => unregisterComponent(elem));
        this.elements = [];

        this.width = jsonObj.width;
        this.height = jsonObj.height;
      }

      invisible.push(...jsonObj.invisible);
      jsonObj.componentTree.components.forEach(componentData => {
        if (!resetOld) componentData.id = "-";

        const component = componentFromJson(componentData);

        if (component) {
          this.elements.push(component);
          registerComponent(component);
        } else {
          console.error("Unable to import component", componentData);
        }
      });

      try {
        await Promise.all([
          ...jsonObj.fonts.map(font =>
            registerFontBase64(font.data, font.name)
          ),
          ...jsonObj.images.map(image =>
            registerImageBase64(image.data, image.name)
          )
        ]);
      } catch (exc) {
        console.error(exc);
      }

      this.pauseRendering = false;
    },

    async checkForUpload() {
      const selector = this.$refs.importFileSelect as HTMLInputElement;

      if (selector.files?.length) {
        const file = selector.files[0];
        const json = await file.text();
        this.loadFromJsonObj(JSON.parse(json), true);
      }
    },

    triggerImportSelector() {
      (this.$refs.importFileSelect as HTMLElement).click();
    }
  }
});
/*</script>*/

/*<style lang="scss">
@import "@/scss/app.scss";
</style>*/