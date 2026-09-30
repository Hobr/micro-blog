---
date: "2023-07-09"
tags:
  - Linux
  - NeoVim
---

# NeoVim配置初步

为什么是NeoVim?

1. Vim脚本过于晦涩难懂,NeoVim引入了lua作为脚本语言;
2. VSCode过重,NeoVim轻量易配置;
3. Vim极客风。

## 安装

需先安装Nerd Font以及合适的Terminal

以下环境为Archlinux

```bash
yay -S neovim python-neovim

nano ~/.zshrc
```

添加别名

```bash
alias vim='nvim'
alias vi='nvim'
alias v='nvim'
```

## 结构规划

- LICENSE
- README.md
- init.lua **配置入口**
- lua
  - autocmds.lua
  - basic.lua **基础配置**
  - colorscheme.lua **主题配置**
  - keybindings.lua **快捷键配置**
  - lsp **内置LSP配置**
    - cmp.lua
    - config **语言服务器单独的配置**
      - bash.lua
      - emmet.lua
      - html.lua
      - json.lua
      - lua.lua
      - markdown.lua
      - pyright.lua
      - rust.lua
      - ts.lua
    - formatter.lua **独立的代码格式化**
    - null-ls.lua
    - setup.lua **内置LSP配置**
    - ui.lua **内置LSP功能增强和UI美化**
  - plugin-config **第三方插件配置**
    - bufferline.lua
    - comment.lua
    - dashboard.lua
    - gitsigns.lua
    - indent-blankline.lua
    - lualine.lua
    - nvim-autopairs.lua
    - nvim-tree.lua
    - nvim-treesitter.lua
    - project.lua
    - surround.lua
    - telescope.lua
    - toggleterm.lua
    - vimspector.lua
    - which-key.lua
  - plugins.lua **插件管理**
  - utils **常见问题适配**
    - fix-yank.lua
    - globals.lua
    - im-select.lua

## 配置文件

`~/.config/nvim/init.lua`

```lua
require('basic')
```

`~/.config/nvim/lua/basic.lua`

```lua
-- UTF-8
vim.g.encoding = "UTF-8"
vim.o.fileencoding = 'utf-8'
-- jkhl 移动时光标周围保留8行
vim.o.scrolloff = 8
vim.o.sidescrolloff = 8
-- 使用相对行号
vim.wo.number = true
vim.wo.relativenumber = true
-- 高亮所在行
vim.wo.cursorline = true
-- 显示左侧图标指示列
vim.wo.signcolumn = "yes"
-- 右侧参考线,超过表示代码太长了,考虑换行
vim.wo.colorcolumn = "80"
-- 缩进2个空格等于一个Tab
vim.o.tabstop = 2
vim.bo.tabstop = 2
vim.o.softtabstop = 2
vim.o.shiftround = true
-- >> << 时移动长度
vim.o.shiftwidth = 2
vim.bo.shiftwidth = 2
-- 空格替代tab
vim.o.expandtab = true
vim.bo.expandtab = true
-- 新行对齐当前行
vim.o.autoindent = true
vim.bo.autoindent = true
vim.o.smartindent = true
-- 搜索大小写不敏感,除非包含大写
vim.o.ignorecase = true
vim.o.smartcase = true
-- 搜索不要高亮
vim.o.hlsearch = false
-- 边输入边搜索
vim.o.incsearch = true
-- 命令行高为2,提供足够的显示空间
vim.o.cmdheight = 2
-- 当文件被外部程序修改时,自动加载
vim.o.autoread = true
vim.bo.autoread = true
-- 禁止折行
vim.wo.wrap = false
-- 光标在行首尾时<Left><Right>可以跳到下一行
vim.o.whichwrap = '<,>,[,]'
-- 允许隐藏被修改过的buffer,否则切换buffer会E37报错
vim.o.hidden = true
-- 鼠标支持
vim.o.mouse = "a"
-- 禁止创建备份文件
vim.o.backup = false
vim.o.writebackup = false
vim.o.swapfile = false
-- smaller updatetime
vim.o.updatetime = 300
-- 连续快捷键判定时间
vim.o.timeoutlen = 500
-- split window 从下边和右边出现
vim.o.splitbelow = true
vim.o.splitright = true
-- 自动补全不自动选中
vim.g.completeopt = "menu,menuone,noselect,noinsert"
-- 样式
vim.o.background = "dark"
vim.o.termguicolors = true
vim.opt.termguicolors = true
-- 不可见字符的显示,这里只把空格显示为一个点
vim.o.list = true
vim.o.listchars = "space:·"
-- 补全增强
vim.o.wildmenu = true
-- Dont' pass messages to |ins-completin menu|
vim.o.shortmess = vim.o.shortmess .. 'c'
-- 补全最多显示10行
vim.o.pumheight = 10
-- 永远显示 tabline,配合对应plugin
vim.o.showtabline = 2
-- 使用增强状态栏插件后不再需要 vim 的模式提示
vim.o.showmode = false
```

- vim.g **全局变量**
- vim.b **缓冲区变量**
- vim.w **窗口变量**
- vim.bo **buffer-local选项**
- vim.wo **window-local选项**

每个变量的分类可以在 _:help_ 查到

## 快捷键

快捷键是提高开发效率的关键。我们需要让快捷键适应我们的习惯,把我们的习惯告诉Vim。

Vim中,**Normal**模式本身就是快捷键模式,同样,其他模式也可以设置快捷键,这里的快捷键指_快捷键的快捷键_,即把一个或多个连续的按键进行映射等等。

### 如何设置

```lua
vim.api.nvim_set_keymap()     -- 全局快捷键
vim.api.nvim_buf_set_keymap() -- Buffer快捷键
```

通常是定义全局快捷键,Buffer快捷键一般用于某些异步回调函数里使用。

`vim.api.nvim_set_keymap('模式', '按键', '映射为','options')`

1. 模式 用一个字母表示,常见的有
1. n Normal
1. i insert
1. v visaul
1. t terminal
1. c command
1. 按键 按下的按键
1. 映射为 可以是按键、按键组合或命令
1. options 大部分设置为`{noremap=true, silent=true}`。
1. `noremap`表示不会重新映射。
1. `silent=true`表示不会又多余输出信息。

### Leader Key

**Leader Key**是常用的前缀,通常设置为_空格_。

```lua
vim.g.mapleader = " "
vim.g.maplocalleader = " "
```

以后定义快捷键时看到**leader** 就表示_空格_。

为了简化后续步骤,先简化出map函数及参数

```lua
-- map()
local map = vim.api.nvim_set_keymap
-- opt
local opt = {noremap=true, silent=true}
```

以后就可以直接使用`map('模式', '按键', '映射为', opt)`进行映射了。

### 窗口管理

定义以下快捷键,可根据个人习惯修改按键

- s Split
- sh Split Horizontal 水平分屏
- sv Split Vertical 垂直分屏
- sc Split Close 关闭当前窗口
- so Split Other 关闭其他乘客
- ALT+h/j/k/l 窗口间跳转

```lua
-- 取消 s 默认功能
map("n", "s", "", opt)
-- windows 分屏快捷键
map("n", "sv", ":vsp<CR>", opt)
map("n", "sh", ":sp<CR>", opt)
-- 关闭当前
map("n", "sc", "<C-w>c", opt)
-- 关闭其他
map("n", "so", "<C-w>o", opt)
-- Alt + h/j/k/l 窗口跳转
map("n", "<A-h>", "<C-w>h", opt)
map("n", "<A-j>", "<C-w>j", opt)
map("n", "<A-k>", "<C-w>k", opt)
map("n", "<A-l>", "<C-w>l", opt)
```

调整窗口比例,**Ctrl+上下左右**或**s,** **s.** **sj** **sk**,**s=**等比例。

```lua
--- 调整窗口比例
-- 左右比例控制
map("n", "<C-Left>", ":vertical resize -2<CR>", opt)
map("n", "<C-Right>", ":vertical resize +2<CR>", opt)
map("n", "s,", ":vertical resize -20<CR>", opt)
map("n", "s.", ":vertical resize +20<CR>", opt)
-- 上下比例
map("n", "sj", ":resize +10<CR>", opt)
map("n", "sk", ":resize -10<CR>", opt)
map("n", "<C-Down>", ":resize +2<CR>", opt)
map("n", "<C-Up>", ":resize -2<CR>", opt)
-- 等比例
map("n", "s=", "<C-w>=", opt)
```

#### 终端

Neovim默认命令行要用*Ctrl+\*退出,这里映射为*Esc*,_leader+t_在下方打开,_leader+vt_在侧面打开。

```lua
--- Terminal
-- 下方
map("n", "<leader>t", ":sp | terminal<CR>", opt)
-- 侧方
map("n", "<leader>vt", ":vsp | terminal<CR>", opt)
-- 退出
map("t", "<Esc>", "<C-\\><C-n>", opt)
-- Alt + h/j/k/l 窗口跳转
map("t", "<A-h>", [[ <C-\><C-N><C-w>h ]], opt)
map("t", "<A-j>", [[ <C-\><C-N><C-w>j ]], opt)
map("t", "<A-k>", [[ <C-\><C-N><C-w>k ]], opt)
map("t", "<A-l>", [[ <C-\><C-N><C-w>l ]], opt)
```

### Visual模式

实现_J_ _K_上下移动选中代码,连续缩进代码。

```lua
--- Visual模式
-- 缩进
map("v", "<", "<gv", opt)
map("v", ">", ">gv", opt)
-- 上下移动选中文本
map("v", "J", ":move '>+1<CR>gv-gv", opt)
map("v", "K", ":move '<-2<CR>gv-gv", opt)
```

### 浏览代码

在浏览多页代码时我们需要快速移动,所以我们再准备一组新快捷键,下面的行数根据个人习惯决定。

- Ctrl+j/k 移动4行
- Ctrl+u/d 移动9行/半页

```lua
--- 浏览代码
-- 4行
map("n", "<C-j>", "4j", opt)
map("n", "<C-k>", "4k", opt)
-- 9行/半屏
map("n", "<C-u>", "9k", opt)
map("n", "<C-d>", "9j", opt)
```

闲杂配置

```lua
--- 其他配置
-- 在visual模式里粘贴不要复制
map("v", "p", '"_dP', opt)
-- 退出
map("n", "q", ":q<CR>", opt)
map("n", "qq", ":q!<CR>", opt)
map("n", "Q", ":qa!<CR>", opt)
-- insert 模式下,跳到行首行尾
map("i", "<C-h>", "<ESC>I", opt)
map("i", "<C-l>", "<ESC>A", opt)
```

## 包管理器

常见的有[vim-plug](https://github.com/junegunn/vim-plug)和[packer.nvim](https://github.com/wbthomason/packer.nvim),前者简单且兼容Vim和NeoVim,后者功能更强大,全lua开发,以下使用packer.nvim。要注意的是该管理器插件都在github上,需要网络支持,首先我们安装它。

```bash
# Linux
git clone --depth 1 https://github.com/wbthomason/packer.nvim\
 ~/.local/share/nvim/site/pack/packer/start/packer.nvim

# Windows Powershell
git clone https://github.com/wbthomason/packer.nvim "$env:LOCALAPPDATA\nvim-data\site\pack\packer\start\packer.nvim"
```

安装好后创建新的文件_lua/plugin.lua_管理插件。

```lua
local packer = require("packer")

packer.startup(
  function(use)
   -- Packer 可以管理自己本身
   use 'wbthomason/packer.nvim'
   -- 你的插件列表...
end)
```

安装插件的方法是`use 'name/repo'`,_name/repo_对应github。

安装完成后,我们可以使用以下命令

- :PackerSync
  - :PackerUpdate
    - :PackerClean
    - :PackerInstall
  - :PackerCompile
- :PackerLoad

而我们通常安装和更新插件只需要用 _:PackerSync_。

### 自动安装

```lua
-- 每次保存 plugins.lua 自动安装插件
pcall(
  vim.cmd,
  [[
    augroup packer_user_config
    autocmd!
    autocmd BufWritePost plugins.lua source <afile> | PackerSync
    augroup end
  ]]
)
```

由于目前NeoVim的lua还没提供自动命令api,所以调用了vim脚本执行。

**pcall**是lua的函数,用于捕捉错误,返回bool。

## 编辑器主题

在_init.lua_里新增

```lua
--- 主题
require("colorscheme")
```

创建lua/colorscheme.lua

```lua
local colorscheme = "主题"

local status_ok, _ = pcall(vim.cmd, "colorscheme " .. colorscheme)

if not status_ok then
  vim.notify("colorscheme " .. colorscheme .. " 没有找到！")
  return
end
```

**pcall**函数之前提过,lua中用 **..** 连接字符串

主题可自行到[nvim-treesitter/Colorscheme](https://github.com/nvim-treesitter/nvim-treesitter/wiki/Colorschemes)中寻找,因为后面要用到**nvim-treesitter**,所以我们最好用它推荐的主题,找到后记得在_plugin.lua_中安装！

## 侧边栏

目前最流行的是[nvim-tree](https://github.com/kyazdani42/nvim-tree.lua),在_lua/plugin_中增加

```lua
use({ "nvim-tree/nvim-tree.lua", requires = "nvim-tree/nvim-web-devicons" })
```

我们现在只是安装好了侧边栏,下面创建_lua/plugin-config/nvim-tree.lua_文件,添加以下内容

```lua
local status, nvim_tree = pcall(require, "nvim-tree")

if not status then
    vim.notify("没有找到 nvim-tree")
  return
end

-- 列表操作快捷键
local list_keys = require('keybindings').nvimTreeList
nvim_tree.setup({
    -- 不显示 git 状态图标
    git = {
        enable = false,
    },
    -- project plugin 需要这样设置
    update_cwd = true,
    update_focused_file = {
        enable = true,
        update_cwd = true,
    },
    -- 隐藏 .文件 和 node_modules 文件夹
    filters = {
        dotfiles = true,
        custom = { 'node_modules' },
    },
    view = {
        -- 宽度
        width = 40,
        -- 也可以 'right'
        side = 'left',
        -- 隐藏根目录
        hide_root_folder = false,
        -- 自定义列表中快捷键
        mappings = {
            custom_only = false,
            list = list_keys,
        },
        -- 不显示行数
        number = false,
        relativenumber = false,
        -- 显示图标
        signcolumn = 'yes',
    },
    actions = {
        open_file = {
            -- 首次打开大小适配
            resize_window = true,
            -- 打开文件时关闭
            quit_on_open = true,
        },
    },
    -- wsl-open
    --[[system_open = {
        cmd = 'wsl-open',
    },]]
})

-- 自动关闭
vim.cmd([[
  autocmd BufEnter * ++nested if winnr('$') == 1 && bufname() == 'NvimTree_' . tabpagenr() | quit | endif
]])
```

如果打算在WSL下用Windows资源管理器打开文件,可以使用wsl-open,需要先安装`npm install -g wsl-open`。

我们上面引入了快捷键绑定配置,打开配置文件,写入以下代码

```lua
--- 插件快捷键
local pluginKeys = {}

-- nvim-tree
-- alt + m 键打开关闭tree
map("n", "<A-m>", ":NvimTreeToggle<CR>", opt)
-- 列表快捷键
pluginKeys.nvimTreeList = {
  -- 打开文件或文件夹
  { key = {"<CR>", "o", "<2-LeftMouse>"}, action = "edit" },
  -- 分屏打开文件
  { key = "v", action = "vsplit" },
  { key = "h", action = "split" },
  -- 显示隐藏文件
  { key = "i", action = "toggle_custom" }, -- 对应 filters 中的 custom (node_modules)
  { key = ".", action = "toggle_dotfiles" }, -- Hide (dotfiles)
  -- 文件操作
  { key = "<F5>", action = "refresh" },
  { key = "a", action = "create" },
  { key = "d", action = "remove" },
  { key = "r", action = "rename" },
  { key = "x", action = "cut" },
  { key = "c", action = "copy" },
  { key = "p", action = "paste" },
}
return pluginKeys
```

并且在init.lua里引入插件

```lua
-- 插件
require("plugin-config.nvim-tree")
```

我们上面设置了几个快捷键

- Alt+m 开关侧边栏
- j/k 上下移动
- Alt+h/l 左右窗口跳转

### 迁移

最近nvim-tree推出了新的快捷键映射方法,需要我们手动操作一下

打开nvim,输入命令`:NvimTreeGenerateOnAttach`,将 _/tmp/my_on_attach.lua_文件内容复制到 _nvim-tree.lua_开头,删掉默认的按键映射,并在映射前加入函数`api.config.mappings.default_on_attach(bufnr)`,随后在nvim_tree.setup中添加`on_attach = on_attach,`,之后删除现有的_view.mappings_,再次启动时就不会提示了。

## 标签栏

下面我们安装标签栏，在包管理处新增，然后安装

```lua
-- 标签页
use({ "akinsho/bufferline.nvim", requires = "nvim-tree/nvim-web-devicons", "moll/vim-bbye"})
```

创建_lua/plugin-config/bufferline.lua_文件

```lua
local status, bufferline = pcall(require, "bufferline")
if not status then
    vim.notify("没有找到 bufferline")
  return
end

-- bufferline 配置
-- https://github.com/akinsho/bufferline.nvim#configuration
bufferline.setup({
  options = {
    -- 关闭 Tab 的命令，这里使用 moll/vim-bbye 的 :Bdelete 命令
    close_command = "Bdelete! %d",
    right_mouse_command = "Bdelete! %d",
    -- 侧边栏配置
    -- 左侧让出 nvim-tree 的位置，显示文字 File Explorer
    offsets = {
      {
        filetype = "NvimTree",
        text = "File Explorer",
        highlight = "Directory",
        text_align = "left",
      },
    },
    -- 使用 nvim 内置 LSP  后续课程会配置
    diagnostics = "nvim_lsp",
    -- 可选，显示 LSP 报错图标
    ---@diagnostic disable-next-line: unused-local
    diagnostics_indicator = function(count, level, diagnostics_dict, context)
      local s = " "
      for e, n in pairs(diagnostics_dict) do
        local sym = e == "error" and " " or (e == "warning" and " " or "")
        s = s .. n .. sym
      end
      return s
    end,
  },
})
```

然后在快捷键映射文件新增映射

```lua
--- bufferline
-- 左右Tab切换
map("n", "<C-h>", ":BufferLineCyclePrev<CR>", opt)
map("n", "<C-l>", ":BufferLineCycleNext<CR>", opt)
-- 关闭
--"moll/vim-bbye"
map("n", "<C-w>", ":Bdelete!<CR>", opt)
map("n", "<leader>bl", ":BufferLineCloseRight<CR>", opt)
map("n", "<leader>bh", ":BufferLineCloseLeft<CR>", opt)
map("n", "<leader>bc", ":BufferLinePickClose<CR>", opt)
```

- Ctrl+h/l 左右切换标签页
- Ctrl+w 关闭标签页
- leader+bl/bh 关闭左/右标签页
- leader+bc 选择要关闭的标签页

最后在入口文件处引入我们的配置，大功告成。
