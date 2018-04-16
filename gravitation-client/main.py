# -*- coding: UTF-8 -*-

import urllib
from urllib import request, parse
import json
import _thread
import time

from conf import *
from chess import *
import app

def getData(req_url):
    s = time.time()
    req = request.Request(req_url)
    resp = request.urlopen(req)
    result = json.loads(resp.read())
    e = time.time()
    print("get data from S: [%s] -> [%s], cost: %s" % (req_url, result, int(e-s)))
    return result

def postData(req_url, _data):
    data = json.dumps(_data).encode('utf-8')
    header = {'content-type': 'application/json'}
    print("start post data to S: [%s], [%s] -> [%s]" % (req_url, data, header, ))
    req = request.Request(req_url, data=data, headers=header)
    resp = request.urlopen(req)
    result = json.loads(resp.read())
    print("post data to S: [%s], [%s] -> [%s]" % (req_url, data, result, ))
    return result


def login(gobang, chess):
    '''
    登录上服务器, 寻找对手
    '''
    playerId = config['playerId']
    rt_login = getData(config['service']['login'] % {'domain': config['domain'], 'playerId': playerId})
    if rt_login['code'] == 200:
        data = rt_login['data']
        print("寻找结果: %s " % (data,))
        # 判断状态, 是匹配成功, 还是在等待对手中...
        if data['offensive'] is not None:
            # 把数据写入chess
            chess.start_battle(data['player1Id'], data['player2Id'], data['offensive'])
            gobang.show_message('系统消息', '#%s# 进入房间开始对战' % chess.playerId)
            gobang.show_message('系统消息', '#%s# 先手' % data['offensive'])
        else:
            # 等待对手中...
            print("wait opponent...")
            gobang.show_message('系统消息', '#%s# 进入房间等待对手' % chess.playerId)
    else:
        # 重试
        print("login fail: %s" % rt_login)
        gobang.show_message('系统消息', '服务器异常[%s]' % rt_login.get('message'))


def start_bg_thread(gobang, chess):

    def get_data(gobang, chess):
        '''
        后台进程, 采用长轮询方式获取服务端Push过来的消息
        '''
        while chess.end == False:
            get_url = config['service']['get'] % {'domain': config['domain'], 'playerId': chess.playerId}
            print("等待服务端消息....")
            get_result = getData(get_url)

            if get_result['code'] == 200:
                events = get_result['data']
                for event in events:
                    if 'flag' in event:
                        if event['flag'] == 1: # AttackChessEvent
                            # 添加到chess里
                            chess.attacked(event['x'], event['y'], event['round'])
                            # 显示对方的棋子
                            fill_color = 'red' if event['round'] % 2 == 1 else 'black'
                            gobang.show_piece(event['x'], event['y'], fill_color)

                            if event['end'] == True:
                                chess.battle_end(event['winner'])
                                gobang.show_message('系统消息', '本局战斗结束, 胜者是: %s' % (event['winner']))

                        elif event['flag'] == 2: # MessageChessEvent
                            # 显示消息到show_message
                            gobang.show_message(event['sender'], event['body'])
                        elif event['flag'] == 3: # BattleChessEvent
                            # 寻找到对手, 发一条系统消息, 通知玩家可以开始了
                            chess.start_battle(event['player1Id'], event['player2Id'], event['offensive'])
                            gobang.show_message('系统消息', '#%s# 进入房间开始对战' % event['player2Id'])
                            gobang.show_message('系统消息', '#%s# 先手' % event['offensive'])
                        else:
                            # 未知的消息类型, 发一个[系统消息]: 未知的消息类型
                            gobang.show_message('系统消息', '未知消息类型[%s]' % event['flag'])
                    else:
                        print("客户端断开连接[连接超时]")
            else:
                # 未知的消息类型, 发一个[系统消息]: 服务器错误
                gobang.show_message('系统消息', '服务器异常[%s]' % get_result.get('message'))

    # 提交
    _thread.start_new_thread(get_data, (gobang, chess, ))


def bind_events(gobang, chess):

    def chessboard_click(event):
        LATTICE_WIDTH = config['lattice']['width']
        pos_x = int((event.x + LATTICE_WIDTH/2) // LATTICE_WIDTH)
        pos_y = int((event.y + LATTICE_WIDTH/2) // LATTICE_WIDTH)
        print("mouse click, x: %s, y: %s, p_x: %s, p_y: %s" % (event.x, event.y, pos_x, pos_y))

        # 判断棋盘上(poy_x, pos_y)位置上有无棋子
        if chess.can_move(pos_x, pos_y) == False:
            print("move to (%s, %s) fail!" % (pos_x, pos_y))
            return 1

        attack_url = config['service']['attack'] % {'domain': config['domain'], 'playerId': chess.playerId, 'x': pos_x, 'y': pos_y}
        attack_result = postData(attack_url, {})
        if attack_result['code'] == 200:
            attack_data = attack_result['data']

            if attack_data['effective'] == True:
                if attack_data['end'] == True:
                    chess.battle_end(attack_data['winner'])
                    gobang.show_message('系统消息', '本局战斗结束, 胜者是: %s' % (attack_data['winner']))

                fill_color = 'red' if chess.round % 2 == 0 else 'black'
                chess.move(pos_x, pos_y)
                gobang.show_piece(pos_x, pos_y, fill_color)

            else:
                gobang.show_message('系统消息', '服务器异常[%s]' % attack_data.get('message'))

        else:
            gobang.show_message('系统消息', '服务器异常[%s]' % attack_result.get('message'))

    def send_message(event):
        # print("key event: %s, text: %s, char: %s" % (event, event.keysym, event.char=='\r'))
        if event.char == '\r':
            # 回车
            input_text = gobang.entry_message.get()
            # post to server
            # 成功就显示到展示区
            chat_url = config['service']['chat'] % {'domain': config['domain']}
            chat_result = postData(chat_url, {'sender': chess.playerId, 'body': input_text})
            if chat_result['code'] == 200:
                gobang.send_message(chess.playerId, input_text)
            else:
                gobang.show_message('系统消息', '消息发送失败[%s]' % chat_result.get('message'))

    print("gobang.game: %s" % gobang.game)
    print("gobang.entry: %s" % gobang.entry_message)
    gobang.game.bind('<Button-1>', chessboard_click)
    gobang.entry_message.bind('<Key>', send_message)

gobang = app.Gobang()
chess = Chess()

# 给控件添加事件
bind_events(gobang, chess)

# 登录服务器, 寻找对手
login(gobang, chess)

# 开启后台进程
start_bg_thread(gobang, chess)

gobang.game_start()
