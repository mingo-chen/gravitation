from conf import *

LATTICE_SIZE = config['lattice']['size']

class Chess(object):

    def __init__(self):
        # 初始化棋盘, 所有位置都是-1, 表示没有下
        # 先手下过用0 => self.round % 2 == 0
        # 后手下过用1 => self.round % 2 == 1
        self.board = []
        for y in range(LATTICE_SIZE):
            row = []
            for x in range(LATTICE_SIZE):
                row.append(-1)

            self.board.append(row)

        # 回合数
        self.round = 0
        # 玩家ID
        self.playerId = config['playerId']
        self.offensive = ""
        # 是否结束
        self.end = False


    def start_battle(self, p1Id, p2Id, offensive):
        self.player1Id = p1Id
        self.player2Id = p2Id
        self.offensive = offensive
        # self.debug()


    def can_move(self, x, y):
        # 瞎鸡巴乱点
        if x < 1 or x > LATTICE_SIZE or y < 1 or y > LATTICE_SIZE:
            return False

        # 战斗是否开始
        if self.offensive == "":
            print("战斗还未开始")
            return False

        # 战斗已经结束
        if self.end == True:
            print("战斗已经结束")
            return False

        # 已经下过
        if self.board[y-1][x-1] != -1:
            print("(%x, %y) 已经下过" % (x, y))
            return False

        # 判断是否轮到我
        if((self.offensive == self.playerId and self.round % 2 == 1) or (self.offensive != self.playerId and self.round % 2 == 0)):
            print("还未轮到我!")
            return False

        # 其它情况, 就默认为可以
        return True


    def move(self, x, y):
        '''我主动下'''
        self.board[y-1][x-1] = 0 if self.round % 2 == 0 else 1
        self.round = self.round + 1
        # self.debug()

        # check is end!
        return True


    def attacked(self, x, y, round):
        '''被攻击'''
        self.board[y-1][x-1] = 0 if round % 2 == 1 else 1
        self.round = round
        # self.debug()


    def battle_end(self, winner):
        self.end = True
        self.winner = winner
        print("战斗结束, 胜者: %s" % self.winner)


    def debug(self):
        for y in range(LATTICE_SIZE):
            line = []
            for x in range(LATTICE_SIZE):
                if self.board[y][x] == 1:
                    line.append('O')
                elif self.board[y][x] == 0:
                    line.append('X')
                else:
                    line.append('@')

            print(' '.join(line))

        print("Round: %s" % self.round)
