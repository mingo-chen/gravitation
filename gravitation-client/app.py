from tkinter import *
from tkinter import scrolledtext
from conf import *

class Gobang(object):

    def __init__(self):
        self.main = Tk()

        LATTICE_WIDTH = config['lattice']['width']
        LATTICE_SIZE = config['lattice']['size']
        game_height = LATTICE_WIDTH * (LATTICE_SIZE + 1)
        support_width = int(game_height * 0.4)
        print("game heigth: %s, support width: %s" % (game_height, support_width))

        frm_game = Frame(self.main, height=game_height, width=game_height, bg='red')
        frm_support = Frame(self.main, height=game_height, width=support_width, bg='blue')
        frm_game.pack(fill=Y, side=LEFT)
        frm_support.pack(fill=Y, side=RIGHT)

        # 对局数据
        # chess = Chess()
        # 添加画布, 展示棋盘
        self.game = self.create_checkerboard(frm_game, LATTICE_WIDTH)
        self.game.pack()
        # canvas.grid(row=0, column=0)
        # add_checkerboard_event(self.game, chess)

        # 添加其它信息
        # 回合数
        lbl_pady = int(LATTICE_WIDTH * 0.2)
        lbl_history_record = Label(frm_support, text='历史战绩 7:6', width=support_width)
        lbl_history_record.pack(fill=X, pady=LATTICE_WIDTH)
        self.history_record = lbl_history_record

        lbl_play1_time = Label(frm_support, text='黑方耗时: 3分24秒', width=support_width)
        lbl_play1_time.pack(fill=X, pady=lbl_pady)

        lbl_play2_time = Label(frm_support, text='红方耗时: 7分01秒', width=support_width)
        lbl_play2_time.pack(fill=X, pady=lbl_pady)

        lbl_round= Label(frm_support, text='第23手', width=support_width)
        lbl_round.pack(fill=X, pady=lbl_pady)
        self.lbl_round = lbl_round

        # 聊天内容
        txt_message = scrolledtext.ScrolledText(frm_support, width=support_width, height=100, wrap=WORD, state='disabled')
        #lbl_message.pack(side=BOTTOM, pady=lbl_pady)
        self.text_message = txt_message

        # 文本输入框
        entry_message = Entry(frm_support, text='打个招呼吧...', width=support_width)
        entry_message.pack(side=BOTTOM, pady=LATTICE_WIDTH)
        txt_message.pack(side=BOTTOM, pady=lbl_pady)

        # entry_message_event(entry_message, txt_message, chess)
        self.entry_message = entry_message


    def create_checkerboard(self, subject, lattice_width):
        LATTICE_SIZE = config['lattice']['size']
        LENGTH = lattice_width * (LATTICE_SIZE + 1)
        canvas = Canvas(subject, width=LENGTH, height=LENGTH)

        board_length = lattice_width * (LATTICE_SIZE - 1)
        base_x = lattice_width
        base_y = lattice_width

        for idx in range(LATTICE_SIZE):
            offset_pos = (idx+1) * lattice_width
            canvas.create_line(base_x, offset_pos, base_x + board_length, offset_pos)
            canvas.create_line(offset_pos, base_y, offset_pos, base_y + board_length)

        return canvas

    def show_message(self, sender, message):
        '''
        展示消息
        '''
        self.text_message.configure(state='normal')
        self.text_message.insert('end', '\n[%s]: %s' % (sender, message))
        self.text_message.configure(state='disabled')

    def show_piece(self, pos_x, pos_y, fill_color):
        LATTICE_WIDTH = config['lattice']['width']
        r = LATTICE_WIDTH * 1 / 3
        x1 = pos_x * LATTICE_WIDTH - r
        y1 = pos_y * LATTICE_WIDTH - r
        x2 = pos_x * LATTICE_WIDTH + r
        y2 = pos_y * LATTICE_WIDTH + r

        self.game.create_oval(x1, y1, x2, y2, fill=fill_color)


    def game_start(self):
        self.main.resizable(0, 0)

        LATTICE_WIDTH = config['lattice']['width']
        LATTICE_SIZE = config['lattice']['size']
        game_height = LATTICE_WIDTH * (LATTICE_SIZE + 1)
        support_width = int(game_height * 0.4)
        print("game heigth: %s, support width: %s" % (game_height, support_width))

        #居中显示
        w_width = game_height + support_width
        w_height = game_height
        print("window width: %s, window heigth: %s" % (w_width, w_height))
        screenwidth = self.main.winfo_screenwidth()
        screenheight = self.main.winfo_screenheight()
        size = '%dx%d+%d+%d' % (w_width, w_height, (screenwidth - w_width)/2, (screenheight - w_height)/2)
        print("window size: %s" % size)
        self.main.geometry(size)
        self.main.mainloop()


    def send_message(self, sender, message):
        self.entry_message.delete(0, END)
        self.show_message(sender, message)
